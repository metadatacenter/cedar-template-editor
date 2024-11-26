// transform.test.js
import { getValuefromJson } from '../../src/formsave/JsonToArray.js';

const emptyTemplate = {
    '@context': {
        rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
        xsd: 'http://www.w3.org/2001/XMLSchema#',
        pav: 'http://purl.org/pav/',
        schema: 'http://schema.org/',
        oslc: 'http://open-services.net/ns/core#',
        skos: 'http://www.w3.org/2004/02/skos/core#',
        'rdfs:label': { '@type': 'xsd:string' },
        'schema:isBasedOn': { '@type': '@id' },
        'schema:name': { '@type': 'xsd:string' },
        'schema:description': { '@type': 'xsd:string' },
        'pav:derivedFrom': { '@type': '@id' },
        'pav:createdOn': { '@type': 'xsd:dateTime' },
        'pav:createdBy': { '@type': '@id' },
        'pav:lastUpdatedOn': { '@type': 'xsd:dateTime' },
        'oslc:modifiedBy': { '@type': '@id' },
        'skos:notation': { '@type': 'xsd:string' },
        Collaborator: 'https://schema.metadatacenter.org/properties/786c72ac-6dea-446f-b005-5647a8578410',
        'Project Name': 'https://schema.metadatacenter.org/properties/0eeb3fa2-33d0-4b2c-8e95-f13760fca85a',
        Consortium: 'https://schema.metadatacenter.org/properties/7bd33b9b-9954-4a31-9205-3938dbeface4',
        IJC_sample_metadata: 'https://schema.metadatacenter.org/properties/edb45673-3c98-42f4-8624-05332fe67e14',
        Principal_Investigator: 'https://schema.metadatacenter.org/properties/44ea3ec8-175f-46c4-80c2-b27e818ed9cf'
    },
    'Project Name': { '@value': null },
    Consortium: { '@value': null },
    Principal_Investigator: {
        '@context': {
            Name: 'https://schema.metadatacenter.org/properties/882d1bc2-e9ad-4d26-86d2-47dbd5c32fcf',
            Email: 'https://schema.metadatacenter.org/properties/623bee44-e4f2-459a-85db-abd32a638e9f',
            'ORCID': 'https://schema.metadatacenter.org/properties/7469493b-5033-4c1d-a53a-cff9fe78a5a2',
            'Institution / Company': 'https://schema.metadatacenter.org/properties/45c8aeac-6b90-4862-a27e-aeaf21df935e'
        },
        Name: { '@value': null },
        Email: { '@value': null },
        'ORCID': { '@value': null },
        'Institution / Company': {
            '@context': {},
            Name: {},
            Address: {},
            'Country': {},
            '@id': 'https://repo.metadatacenter.orgx/template-element-instances/f30872aa-a9a4-4d17-8575-ce02b96a13bf'
        },
        '@id': 'https://repo.metadatacenter.orgx/template-element-instances/a54d57b2-2afe-4b29-bb1e-3a7b596fac03'
    },
    Collaborator: {
        '@context': {
            Name: 'https://schema.metadatacenter.org/properties/882d1bc2-e9ad-4d26-86d2-47dbd5c32fcf',
            Email: 'https://schema.metadatacenter.org/properties/623bee44-e4f2-459a-85db-abd32a638e9f',
            'ORCID': 'https://schema.metadatacenter.org/properties/7469493b-5033-4c1d-a53a-cff9fe78a5a2',
            'Institution / Company': 'https://schema.metadatacenter.org/properties/45c8aeac-6b90-4862-a27e-aeaf21df935e'
        },
        Name: { '@value': null },
        Email: { '@value': null },
        'ORCID': { '@value': null },
        'Institution / Company': {
            '@context': {},
            Name: {},
            Address: {},
            'Country': {},
            '@id': 'https://repo.metadatacenter.orgx/template-element-instances/cf96d284-e744-4eec-97be-8c20d2b50a03'
        },
        '@id': 'https://repo.metadatacenter.orgx/template-element-instances/92f46e0a-9f8e-45d2-bacc-336050619156'
    },
    IJC_sample_metadata: [
        {
            '@context': {},
            'Sample ID': {},
            'Sample Provider': {},
            'Cell Line Name': {},
            Species: {},
            'Other species': {},
            Sex: {},
            Age: {},
            'Development stage': {},
            'Sample origin': {},
            Celltype: {},
            'Primary culture': {},
            Disease: {},
            Tumor: {},
            'Tumor subtype': {},
            Control: {},
            Treatement: {},
            'Treatment specify': {},
            'Patient clinical data available': {},
            'Patient survival data available': {},
            Notes: {},
            '@id': 'https://repo.metadatacenter.orgx/template-element-instances/a54d57b2-2afe-4b29-bb1e-3a7b596fac03'
        }
    ]
};


const onlySamples = {
    IJC_sample_metadata: [
        {
            '@context': {},
            'Sample ID': {},
            'Sample Provider': {},
            'Cell Line Name': {},
            Species: {},
            'Other species': {},
            Sex: {},
            Age: {},
            'Development stage': {},
            'Sample origin': {},
            Celltype: {},
            'Primary culture': {},
            Disease: {},
            Tumor: {},
            'Tumor subtype': {},
            Control: {},
            Treatement: {},
            'Treatment specify': {},
            'Patient clinical data available': {},
            'Patient survival data available': {},
            Notes: {},
            '@id': 'https://repo.metadatacenter.orgx/template-element-instances/a54d57b2-2afe-4b29-bb1e-3a7b596fac03'
        }
    ]
};

describe('Empty template', () => {
    it('should transform JSON to an array correctly', () => {
        const result = getValuefromJson(emptyTemplate);
        expect(result).toMatchSnapshot();
    });
});

describe('Only samples', () => {
    it('should transform JSON to an array correctly', () => {
        const result = getValuefromJson(onlySamples);
        expect(result).toMatchSnapshot();
    });
});

