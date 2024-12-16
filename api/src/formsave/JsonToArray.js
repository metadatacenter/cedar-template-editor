export function tidyfyTemplateInstance(template, instance) {
  
    if (!template._ui || !template._ui.order)
        return null;

    try{
        let header = [];        
        let values = [];
        for (const key of template._ui.order)
        {            
            const key_instance = instance[key];
            const key_template = template.properties[key];
            if (!key_instance || !key_template)
                continue;
    
            const label = key_template["skos:prefLabel"]? key_template["skos:prefLabel"]: template._ui.propertyLabels[key];
            
            if (key_template._ui && key_template._ui.order && key_template._ui.order.length > 1) {
                const nested_result = tidyfyTemplateInstance(key_template, key_instance);
                for (const header_value of nested_result.header) 
                    header.push(header_value+'|'+label);  

                values.push(nested_result.values);
            } else if (Array.isArray(key_instance)) {
                let arrayValues = [];
                for (let i = 0; i < key_instance.length; i++) {
                    const nested_result = tidyfyTemplateInstance(key_template.items, key_instance[i]);
                    if (i == 0) {
                        for (const header_value of nested_result.header) 
                            header.push(header_value);  
                    }
                    if (!nested_result.values.every(row => row.every(element => element === ''))) // skip empty rows
                        arrayValues.push(...nested_result.values);
                }
                values.push(arrayValues);
            } else {
                header.push(label);
                values.push(getValuefromJson(key_instance));
            }
        }
    
        let max_length = 0;
        for (const value of values) {
            if (Array.isArray(value) && value.length) {
                if (value.length > max_length)
                    max_length = value.length;
            }
        }    
        
        let result_values = [];
        for (let row = 0 ; row < max_length; row++) {
            let row_values = []; 
            for (const value of values) {
                if (Array.isArray(value) && value.length == max_length) {
                    let value_row = value[row];
                    if (Array.isArray(value_row))
                        row_values.push(...value_row);
                    else 
                        row_values.push(value_row);
                } else {
                    // Pick the first value for all the rows
                    if (Array.isArray(value)){
                        if (value.length > 0) {
                            if (Array.isArray(value[0])) 
                                row_values.push(...value[0]);
                            else 
                                row_values.push(value[0]);    
                        } else 
                            row_values.push("");
                    } else                         
                        row_values.push(value);                    
                }
            }
            result_values.push(row_values);
        }
    
        let result = {
            header : header,
            values : result_values
        };

        return result;
    
    } catch (error) {
        console.error('Error in tidyfyTemplateInstance:', error);
        throw error;
    }
}

// Function to transform JSON to a structured array format for Excel
function getValuefromJson(jsonObject, rows = []) { 
    // Check if the item is an array
    if (jsonObject && typeof jsonObject === 'object') {

        // Empty object
        if (Object.keys(jsonObject).length === 0 ) {
            rows.push('');
            return rows;
        }

        // Iterate over the keys in the object
        Object.keys(jsonObject).forEach(key => {
            if (key.startsWith('@') && key != '@value') {
                // Ignore keys starting with '@'
                return;
            }
            // Ingnore keys saring wih $$
            if (key.startsWith('$$') || key.startsWith('skos:notation'))
                return; 

            getValuefromJson(jsonObject[key], rows);
            
        });
    } else if (jsonObject){
        // Add the object to the result
        rows.push(jsonObject);
    } else {
        rows.push('');
    }

    return rows;
}