'use strict';

define([
    'angular'
], function (angular) {
    angular.module('cedar.templateEditor.form.edittimeToolbarDirective', [])
        .directive('edittimeToolbarDirective', edittimeToolbarDirective);

    edittimeToolbarDirective.$inject = ["$rootScope","DataManipulationService","FieldTypeService","controlledTermDataService"];

    function edittimeToolbarDirective($rootScope, DataManipulationService,FieldTypeService,controlledTermDataService) {

        var linker = function ($scope, $element, attrs) {

        };


        return {
            templateUrl: 'scripts/form/edittime-toolbar.directive.html',
            restrict: 'EA',
            scope: {
                fieldOrElement: '=',
                uuid: '=',
                delete: '&',
                duplicate: '&',
                isEdit: '&',
                model: '='
            },
            controller: function ($scope, $element) {


                $scope.hasControlledTerms = function () {

                    var fieldTypes = FieldTypeService.getFieldTypes();
                    var inputType = 'element';
                    if (DataManipulationService.getFieldSchema($scope.fieldOrElement)._ui.inputType) {
                        inputType = DataManipulationService.getFieldSchema($scope.fieldOrElement)._ui.inputType;
                        for (var i = 0; i < fieldTypes.length; i++) {
                            if (fieldTypes[i].cedarType === inputType) {
                                return fieldTypes[i].hasControlledTerms;
                            }
                        }
                    }
                    return false;
                };

                $scope.showModal = function (id) {
                    jQuery("#" + id).modal('show');
                };

                $scope.getModalId = function (isField) {
                    var fieldOrValue = isField ? "field" : "values";
                    var fieldId = $scope.field['@id'] || $scope.field.items['@id'];
                    var id = fieldId.substring(fieldId.lastIndexOf('/') + 1);
                    return "control-options-" + id + "-" + fieldOrValue;
                };



                $scope.getValueModalId = function () {
                    var fieldId = $scope.fieldOrElement['@id'] || $scope.fieldOrElement.items['@id'];
                    var id = fieldId.substring(fieldId.lastIndexOf('/') + 1);
                    return "control-options-" + id + "-" + "values";
                };

                $scope.getFieldModalId = function () {
                    var fieldId = $scope.fieldOrElement['@id'] || $scope.fieldOrElement.items['@id'];
                    var id = fieldId.substring(fieldId.lastIndexOf('/') + 1);
                    return "control-options-" + id + "-" +  "field";
                };


                /* start of controlled terms functionality */

                $scope.addedFields = new Map();
                $scope.addedFieldKeys = [];


                /**
                 * build a map with the added field controlled term id as the key and the details for that class as the value
                 */
                $scope.setAddedFieldMap = function () {


                    var fields = DataManipulationService.getFieldControlledTerms($scope.fieldOrElement);
                    if (fields) {


                        // create a new map to avoid any duplicates coming from the modal
                        var myMap = new Map();

                        // move the keys into the new map
                        for (var i = 0; i < fields.length; i++) {
                            var key = fields[i];
                            if (myMap.has(key)) {

                                // here is a duplicate, so delete it
                                DataManipulationService.deleteFieldControlledTerm(key, $scope.FieldOrElement);
                            } else {
                                myMap.set(key, "");
                            }
                        }

                        // copy over any responses from the old map
                        myMap.forEach(function (value, key) {

                            if ($scope.addedFields.has(key)) {
                                myMap.set(key, $scope.addedFields.get(key));
                            }
                        }, myMap);


                        // get any missing responses
                        myMap.forEach(function (value, key) {
                            if (myMap.get(key) == "") {
                                setResponse(key, DataManipulationService.parseOntologyName(key),
                                    DataManipulationService.parseClassLabel(key));
                            }
                        }, myMap);


                        // fill up the key array
                        $scope.addedFieldKeys = [];
                        myMap.forEach(function (value, key) {
                            $scope.addedFieldKeys.push(key);
                        }, myMap);

                        // hang on to the new map
                        $scope.addedFields = myMap;

                    }
                };


                /**
                 * get the class details from the server.
                 * @param item
                 * @param ontologyName
                 * @param className
                 */
                var setResponse = function (item, ontologyName, className) {

                    // Get selected class details from the links.self endpoint provided.
                    controlledTermDataService.getClassById(ontologyName, className).then(function (response) {
                        $scope.addedFields.set(item, response);
                    });
                };

                /**
                 * get the ontology name from the addedFields map
                 * @param item
                 * @returns {string}
                 */
                $scope.getOntologyName = function (item) {
                    var result = "";
                    if ($scope.addedFields && $scope.addedFields.has(item)) {
                        result = $scope.addedFields.get(item).ontology;
                    }
                    return result;
                };

                /**
                 * get the class description from the addedFields map
                 * @param item
                 * @returns {string}
                 */
                $scope.getPrefLabel = function (item) {
                    var result = "";
                    if ($scope.addedFields && $scope.addedFields.has(item)) {
                        result = $scope.addedFields.get(item).prefLabel;
                    }
                    return result;
                };



                /**
                 * get the class description from the the addedFields map
                 * @param item
                 * @returns {string}
                 */
                $scope.getClassDescription = function (item) {
                    var result = "";
                    if ($scope.addedFields && $scope.addedFields.has(item)) {
                        if ($scope.addedFields.get(item).definitions && $scope.addedFields.get(item).definitions.length > 0) {
                            result = $scope.addedFields.get(item).definitions[0];
                        }
                    }
                    return result;
                };

                $scope.getClassId = function (item) {
                    var result = "";
                    if ($scope.addedFields && $scope.addedFields.has(item)) {
                        if ($scope.addedFields.get(item).definitions && $scope.addedFields.get(item).definitions.length > 0) {
                            result = $scope.addedFields.get(item).id;

                        }
                    }
                    return result;
                };


                $scope.deleteFieldAddedItem = function (itemDataId) {
                    console.log('deleteFieldAddedItem ' + itemDataId);
                    if (itemDataId != null) {
                        console.log($scope.fieldOrElement);
                        DataManipulationService.deleteFieldControlledTerm(itemDataId, $scope.fieldOrElement);

                    }

                    // adjust the map
                    $scope.setAddedFieldMap();
                };

                $scope.parseOntologyCode = function (source) {
                    return DataManipulationService.parseOntologyCode(source);
                };

                $scope.parseOntologyName = function (dataItemsId) {
                    return DataManipulationService.parseOntologyName(dataItemsId);
                };

                $scope.deleteFieldAddedBranch = function (branch) {
                    DataManipulationService.deleteFieldAddedBranch(branch, $scope.fieldOrElement);
                };

                $scope.deleteFieldAddedClass = function (ontologyClass) {
                    DataManipulationService.deleteFieldAddedClass(ontologyClass, $scope.fieldOrElement);
                };

                $scope.deleteFieldAddedOntology = function (ontology) {
                    DataManipulationService.deleteFieldAddedOntology(ontology, $scope.fieldOrElement);
                };

                $scope.deleteFieldAddedValueSet = function (valueSet) {
                    DataManipulationService.deleteFieldAddedValueSet(valueSet, $scope.fieldOrElement);
                };

                $scope.getOntologyCode = function (ontology) {
                    var ontologyDetails = controlledTermDataService.getOntologyByLdId(ontology);
                };

                // use the document height as the modal height
                $scope.getModalHeight = function () {
                    return "height: " + $document.height() + 'px';
                };

                //TODO this event resets modal state and closes modal
                $scope.$on("field:controlledTermAdded", function () {

                    jQuery("#" + $scope.getFieldModalId()).modal('hide');
                    jQuery("#" + $scope.getValueModalId()).modal('hide');

                    // build the added fields map in this case
                    $scope.setAddedFieldMap();

                    console.log($scope.addedFields);

                });


            },
            replace: true,
            link: linker
        };

    }

});