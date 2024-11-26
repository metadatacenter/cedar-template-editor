// formSave.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { formSave } from '../../src/formsave/formSave.js';
import path from 'path';

const RESPONSES_FOLDER = path.join(__dirname, '../../responses');

const emptyTemplte = {
  instance: {
    "@context": {
      rdfs: "http://www.w3.org/2000/01/rdf-schema#",
      xsd: "http://www.w3.org/2001/XMLSchema#",
      pav: "http://purl.org/pav/",
      schema: "http://schema.org/",
      oslc: "http://open-services.net/ns/core#",
      skos: "http://www.w3.org/2004/02/skos/core#",
      "rdfs:label": {
        "@type": "xsd:string",
      },
      "schema:isBasedOn": {
        "@type": "@id",
      },
      "schema:name": {
        "@type": "xsd:string",
      },
      "schema:description": {
        "@type": "xsd:string",
      },
      "pav:derivedFrom": {
        "@type": "@id",
      },
      "pav:createdOn": {
        "@type": "xsd:dateTime",
      },
      "pav:createdBy": {
        "@type": "@id",
      },
      "pav:lastUpdatedOn": {
        "@type": "xsd:dateTime",
      },
      "oslc:modifiedBy": {
        "@type": "@id",
      },
      "skos:notation": {
        "@type": "xsd:string",
      },
      IJC_Collaborator_contact_info: "https://schema.metadatacenter.org/properties/786c72ac-6dea-446f-b005-5647a8578410",
      "Project Name": "https://schema.metadatacenter.org/properties/0eeb3fa2-33d0-4b2c-8e95-f13760fca85a",
      Consortium: "https://schema.metadatacenter.org/properties/7bd33b9b-9954-4a31-9205-3938dbeface4",
      IJC_sample_metadata: "https://schema.metadatacenter.org/properties/edb45673-3c98-42f4-8624-05332fe67e14",
      IJC_PI_contact_info: "https://schema.metadatacenter.org/properties/44ea3ec8-175f-46c4-80c2-b27e818ed9cf",
    },
    IJC_Collaborator_contact_info: {
      "@context": {
        Name: "https://schema.metadatacenter.org/properties/882d1bc2-e9ad-4d26-86d2-47dbd5c32fcf",
        Email: "https://schema.metadatacenter.org/properties/623bee44-e4f2-459a-85db-abd32a638e9f",
        "Principal_Investigator ORCID Text (10624734)": "https://schema.metadatacenter.org/properties/7469493b-5033-4c1d-a53a-cff9fe78a5a2",
        "IJC_institution-company": "https://schema.metadatacenter.org/properties/45c8aeac-6b90-4862-a27e-aeaf21df935e",
      },
      Name: {
        "@value": null,
      },
      Email: {
        "@value": null,
      },
      "Principal_Investigator ORCID Text (10624734)": {
        "@value": null,
      },
      "IJC_institution-company": {
        "@context": {
          "Country Name (3152016)": "https://schema.metadatacenter.org/properties/a39768dc-6e98-4681-b9a2-ae3090679b33",
          Name: "https://schema.metadatacenter.org/properties/d0398a63-37af-44bb-a1b6-ee37f7ddfc64",
          Address: "https://schema.metadatacenter.org/properties/ee59a0c3-50e4-436a-b543-c760f4fd3261",
        },
        "Country Name (3152016)": {
        },
        Name: {
          "@value": null,
        },
        Address: {
          "@value": null,
        },
        $$hashKey: "object:128",
      },
      $$hashKey: "object:67",
    },
    "Project Name": {
      "@value": "sadfsd",
      $$hashKey: "object:607",
    },
    Consortium: {
      "@value": null,
    },
    IJC_sample_metadata: [
      {
        "@context": {
          Tumor: "https://schema.metadatacenter.org/properties/08afe47d-d9fc-4290-aff3-d2fcb3873f92",
          Control: "https://schema.metadatacenter.org/properties/4767ed7e-d048-4941-8e4e-8d945729a243",
          Disease: "https://schema.metadatacenter.org/properties/51bcb11f-e124-45fc-bcca-82899f4d68f3",
          "Primary culture": "https://schema.metadatacenter.org/properties/5454767d-c051-4108-9930-3ff3955918f8",
          "Sample Provider": "https://schema.metadatacenter.org/properties/88647f3a-d381-4f6c-bb42-ad82ed669760",
          "Other species": "https://schema.metadatacenter.org/properties/70cc6996-0a8f-44c6-9d49-f935d221cd00",
          Sex: "https://schema.metadatacenter.org/properties/9da9f3d4-8067-4e70-a3f0-191bcf472101",
          "Development stage": "https://schema.metadatacenter.org/properties/7291a2b8-46b5-40d2-b133-3c390eee524d",
          "Sample origin": "https://schema.metadatacenter.org/properties/47a9e48a-489a-473b-a08a-211ca95cc71a",
          Celltype: "https://schema.metadatacenter.org/properties/6d2cd38e-5154-49d7-8c5d-b392cc2399a1",
          "Treatment specify": "https://schema.metadatacenter.org/properties/4325e81c-52eb-4a5b-b976-f2ff76ebf8e0",
          "Cell Line Name": "https://schema.metadatacenter.org/properties/5dc4dbdf-888d-444f-b81f-e2376bb4f256",
          "Tumor subtype": "https://schema.metadatacenter.org/properties/11e5c598-dfa1-4683-a46b-0d729f9c6d50",
          Treatement: "https://schema.metadatacenter.org/properties/e1979247-df90-45f3-a69d-253d14c12500",
          "Patient clinical data available": "https://schema.metadatacenter.org/properties/d5d85810-861d-4796-bcf6-be601cb8a054",
          "Patient survival data available": "https://schema.metadatacenter.org/properties/bc6ea875-b1fc-4a57-ac3e-dab0158b22c7",
          "Sample name": "https://schema.metadatacenter.org/properties/21be2752-1b07-48cb-8e57-3bcdf2b38071",
          "Sample preservation": "https://schema.metadatacenter.org/properties/6c9337ac-bde5-4822-a6b5-f16da380f53d",
          "DNA concentration measure technology": "https://schema.metadatacenter.org/properties/13744bf3-a684-4da7-be49-d6f9e1850c3a",
          Notes: "https://schema.metadatacenter.org/properties/23f5d351-7f22-45f3-883a-38f62c7d4b47",
          Species: "https://schema.metadatacenter.org/properties/d2e521c3-4a09-4837-a023-bb2f161a0afa",
          "Age value": "https://schema.metadatacenter.org/properties/4e4900c7-a23a-4f90-b8d9-f25d9262dcb6",
          "Age unit": "https://schema.metadatacenter.org/properties/e933f973-7fcb-4c87-bbdd-71ba96c93abd",
        },
        Tumor: {
          "@value": null,
        },
        Control: {
          "@value": null,
        },
        Disease: {
        },
        "Primary culture": {
          "@value": null,
        },
        "Sample Provider": {
          "@value": null,
        },
        "Other species": {
          "@value": null,
        },
        Sex: {
          "@value": null,
        },
        "Development stage": {
          "@value": null,
        },
        "Sample origin": {
        },
        Celltype: {
        },
        "Treatment specify": {
          "@value": null,
        },
        "Cell Line Name": {
          "@value": null,
        },
        "Tumor subtype": {
        },
        Treatement: {
          "@value": null,
        },
        "Patient clinical data available": {
          "@value": null,
        },
        "Patient survival data available": {
          "@value": null,
        },
        "Sample name": {
          "@value": null,
        },
        "Sample preservation": {
          "@value": null,
        },
        "DNA concentration measure technology": {
          "@value": null,
        },
        Notes: {
          "@value": null,
        },
        Species: {
          "@value": null,
        },
        "Age value": {
          "@value": null,
          "@type": "xsd:decimal",
        },
        "Age unit": {
          "@value": null,
        },
        $$hashKey: "object:149",
      },
    ],
    IJC_PI_contact_info: {
      "@context": {
        Name: "https://schema.metadatacenter.org/properties/882d1bc2-e9ad-4d26-86d2-47dbd5c32fcf",
        Email: "https://schema.metadatacenter.org/properties/623bee44-e4f2-459a-85db-abd32a638e9f",
        "Principal_Investigator ORCID Text (10624734)": "https://schema.metadatacenter.org/properties/7469493b-5033-4c1d-a53a-cff9fe78a5a2",
        "IJC_institution-company": "https://schema.metadatacenter.org/properties/45c8aeac-6b90-4862-a27e-aeaf21df935e",
      },
      Name: {
        "@value": null,
        $$hashKey: "object:542",
      },
      Email: {
        "@value": null,
        $$hashKey: "object:553",
      },
      "Principal_Investigator ORCID Text (10624734)": {
        "@value": null,
        $$hashKey: "object:565",
      },
      "IJC_institution-company": {
        "@context": {
          "Country Name (3152016)": "https://schema.metadatacenter.org/properties/a39768dc-6e98-4681-b9a2-ae3090679b33",
          Name: "https://schema.metadatacenter.org/properties/d0398a63-37af-44bb-a1b6-ee37f7ddfc64",
          Address: "https://schema.metadatacenter.org/properties/ee59a0c3-50e4-436a-b543-c760f4fd3261",
        },
        "Country Name (3152016)": {
        },
        Name: {
          "@value": "jk",
          $$hashKey: "object:584",
        },
        Address: {
          "@value": null,
          $$hashKey: "object:595",
        },
        $$hashKey: "object:105",
      },
      $$hashKey: "object:41",
    },
  },
  template: {
    "@id": "https://repo.metadatacenter.org/templates/96760b8a-a1a3-47c3-add8-d087012b174e",
    "@type": "https://schema.metadatacenter.org/core/Template",
    "@context": {
      xsd: "http://www.w3.org/2001/XMLSchema#",
      pav: "http://purl.org/pav/",
      bibo: "http://purl.org/ontology/bibo/",
      oslc: "http://open-services.net/ns/core#",
      schema: "http://schema.org/",
      "schema:name": {
        "@type": "xsd:string",
      },
      "schema:description": {
        "@type": "xsd:string",
      },
      "pav:createdOn": {
        "@type": "xsd:dateTime",
      },
      "pav:createdBy": {
        "@type": "@id",
      },
      "pav:lastUpdatedOn": {
        "@type": "xsd:dateTime",
      },
      "oslc:modifiedBy": {
        "@type": "@id",
      },
    },
    type: "object",
    title: "Bio forms template schema",
    description: "Bio forms template schema generated by the CEDAR Template Editor 2.7.1",
    _ui: {
      order: [
        "Project Name",
        "Consortium",
        "IJC_PI_contact_info",
        "IJC_Collaborator_contact_info",
        "IJC_sample_metadata",
      ],
      propertyLabels: {
        IJC_Collaborator_contact_info: "Collaborator",
        "Project Name": "Project Name",
        Consortium: "Consortium",
        IJC_sample_metadata: "Samples",
        IJC_PI_contact_info: "Principal_Investigator",
      },
      propertyDescriptions: {
        IJC_Collaborator_contact_info: "",
        "Project Name": "",
        Consortium: "If the Project is part of a Consortium, please specify",
        IJC_sample_metadata: "",
        IJC_PI_contact_info: "",
      },
    },
    properties: {
      "@context": {
        type: "object",
        properties: {
          rdfs: {
            type: "string",
            format: "uri",
            enum: [
              "http://www.w3.org/2000/01/rdf-schema#",
            ],
          },
          xsd: {
            type: "string",
            format: "uri",
            enum: [
              "http://www.w3.org/2001/XMLSchema#",
            ],
          },
          pav: {
            type: "string",
            format: "uri",
            enum: [
              "http://purl.org/pav/",
            ],
          },
          schema: {
            type: "string",
            format: "uri",
            enum: [
              "http://schema.org/",
            ],
          },
          oslc: {
            type: "string",
            format: "uri",
            enum: [
              "http://open-services.net/ns/core#",
            ],
          },
          skos: {
            type: "string",
            format: "uri",
            enum: [
              "http://www.w3.org/2004/02/skos/core#",
            ],
          },
          "rdfs:label": {
            type: "object",
            properties: {
              "@type": {
                type: "string",
                enum: [
                  "xsd:string",
                ],
              },
            },
          },
          "schema:isBasedOn": {
            type: "object",
            properties: {
              "@type": {
                type: "string",
                enum: [
                  "@id",
                ],
              },
            },
          },
          "schema:name": {
            type: "object",
            properties: {
              "@type": {
                type: "string",
                enum: [
                  "xsd:string",
                ],
              },
            },
          },
          "schema:description": {
            type: "object",
            properties: {
              "@type": {
                type: "string",
                enum: [
                  "xsd:string",
                ],
              },
            },
          },
          "pav:derivedFrom": {
            type: "object",
            properties: {
              "@type": {
                type: "string",
                enum: [
                  "@id",
                ],
              },
            },
          },
          "pav:createdOn": {
            type: "object",
            properties: {
              "@type": {
                type: "string",
                enum: [
                  "xsd:dateTime",
                ],
              },
            },
          },
          "pav:createdBy": {
            type: "object",
            properties: {
              "@type": {
                type: "string",
                enum: [
                  "@id",
                ],
              },
            },
          },
          "pav:lastUpdatedOn": {
            type: "object",
            properties: {
              "@type": {
                type: "string",
                enum: [
                  "xsd:dateTime",
                ],
              },
            },
          },
          "oslc:modifiedBy": {
            type: "object",
            properties: {
              "@type": {
                type: "string",
                enum: [
                  "@id",
                ],
              },
            },
          },
          "skos:notation": {
            type: "object",
            properties: {
              "@type": {
                type: "string",
                enum: [
                  "xsd:string",
                ],
              },
            },
          },
          IJC_Collaborator_contact_info: {
            enum: [
              "https://schema.metadatacenter.org/properties/786c72ac-6dea-446f-b005-5647a8578410",
            ],
          },
          "Project Name": {
            enum: [
              "https://schema.metadatacenter.org/properties/0eeb3fa2-33d0-4b2c-8e95-f13760fca85a",
            ],
          },
          Consortium: {
            enum: [
              "https://schema.metadatacenter.org/properties/7bd33b9b-9954-4a31-9205-3938dbeface4",
            ],
          },
          IJC_sample_metadata: {
            enum: [
              "https://schema.metadatacenter.org/properties/edb45673-3c98-42f4-8624-05332fe67e14",
            ],
          },
          IJC_PI_contact_info: {
            enum: [
              "https://schema.metadatacenter.org/properties/44ea3ec8-175f-46c4-80c2-b27e818ed9cf",
            ],
          },
        },
        required: [
          "xsd",
          "pav",
          "schema",
          "oslc",
          "schema:isBasedOn",
          "schema:name",
          "schema:description",
          "pav:createdOn",
          "pav:createdBy",
          "pav:lastUpdatedOn",
          "oslc:modifiedBy",
          "IJC_Collaborator_contact_info",
          "IJC_sample_metadata",
          "IJC_PI_contact_info",
        ],
        additionalProperties: false,
      },
      "@id": {
        type: [
          "string",
          "null",
        ],
        format: "uri",
      },
      "@type": {
        oneOf: [
          {
            type: "string",
            format: "uri",
          },
          {
            type: "array",
            minItems: 1,
            items: {
              type: "string",
              format: "uri",
            },
            uniqueItems: true,
          },
        ],
      },
      "schema:isBasedOn": {
        type: "string",
        format: "uri",
      },
      "schema:name": {
        type: "string",
        minLength: 1,
      },
      "schema:description": {
        type: "string",
      },
      "pav:derivedFrom": {
        type: "string",
        format: "uri",
      },
      "pav:createdOn": {
        type: [
          "string",
          "null",
        ],
        format: "date-time",
      },
      "pav:createdBy": {
        type: [
          "string",
          "null",
        ],
        format: "uri",
      },
      "pav:lastUpdatedOn": {
        type: [
          "string",
          "null",
        ],
        format: "date-time",
      },
      "oslc:modifiedBy": {
        type: [
          "string",
          "null",
        ],
        format: "uri",
      },
      IJC_Collaborator_contact_info: {
        "@id": "https://repo.metadatacenter.org/template-elements/5a3f4eab-9390-467c-9bf1-9bb1dabe81be",
        "@type": "https://schema.metadatacenter.org/core/TemplateElement",
        "@context": {
          xsd: "http://www.w3.org/2001/XMLSchema#",
          pav: "http://purl.org/pav/",
          bibo: "http://purl.org/ontology/bibo/",
          oslc: "http://open-services.net/ns/core#",
          schema: "http://schema.org/",
          "schema:name": {
            "@type": "xsd:string",
          },
          "schema:description": {
            "@type": "xsd:string",
          },
          "pav:createdOn": {
            "@type": "xsd:dateTime",
          },
          "pav:createdBy": {
            "@type": "@id",
          },
          "pav:lastUpdatedOn": {
            "@type": "xsd:dateTime",
          },
          "oslc:modifiedBy": {
            "@type": "@id",
          },
        },
        type: "object",
        title: "Ijc_contact_info element schema",
        description: "Ijc_contact_info element schema generated by the CEDAR Template Editor 2.7.1",
        _ui: {
          order: [
            "Name",
            "Email",
            "Principal_Investigator ORCID Text (10624734)",
            "IJC_institution-company",
          ],
          propertyLabels: {
            Name: "Name",
            Email: "Email",
            "Principal_Investigator ORCID Text (10624734)": "Principal_Investigator ORCID Text (10624734)",
            "IJC_institution-company": "Institution / Company",
          },
          propertyDescriptions: {
            Name: "",
            "Email address Contact": "",
            Email: "",
            ORCID: "",
            ORCID1: "",
            "Principal_Investigator ORCID Text (10624734)": "A persistent unique digital identifier assigned to a principal investigator by the Open Researcher and Contributor ID (ORCID) organization.",
            "IJC_institution-company": "",
          },
        },
        properties: {
          "@context": {
            type: "object",
            properties: {
              Name: {
                enum: [
                  "https://schema.metadatacenter.org/properties/882d1bc2-e9ad-4d26-86d2-47dbd5c32fcf",
                ],
              },
              Email: {
                enum: [
                  "https://schema.metadatacenter.org/properties/623bee44-e4f2-459a-85db-abd32a638e9f",
                ],
              },
              "Principal_Investigator ORCID Text (10624734)": {
                enum: [
                  "https://schema.metadatacenter.org/properties/7469493b-5033-4c1d-a53a-cff9fe78a5a2",
                ],
              },
              "IJC_institution-company": {
                enum: [
                  "https://schema.metadatacenter.org/properties/45c8aeac-6b90-4862-a27e-aeaf21df935e",
                ],
              },
            },
            additionalProperties: false,
            required: [
              "Name",
              "Email",
              "Principal_Investigator ORCID Text (10624734)",
              "IJC_institution-company",
            ],
          },
          "@id": {
            type: "string",
            format: "uri",
          },
          "@type": {
            oneOf: [
              {
                type: "string",
                format: "uri",
              },
              {
                type: "array",
                minItems: 1,
                items: {
                  type: "string",
                  format: "uri",
                },
                uniqueItems: true,
              },
            ],
          },
          Name: {
            "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
            "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
            "pav:createdOn": "2024-11-08T02:37:08-08:00",
            "pav:lastUpdatedOn": "2024-11-08T02:37:08-08:00",
            "@type": "https://schema.metadatacenter.org/core/TemplateField",
            "@id": "https://repo.metadatacenter.org/template-fields/868e28c2-5a62-4d48-879b-1b8ad3f2ed6d",
            type: "object",
            title: "Name field schema",
            description: "Name field schema generated by the CEDAR Artifact Library",
            "schema:name": "Name",
            "schema:description": "",
            "schema:schemaVersion": "1.6.0",
            "schema:identifier": "71_Wa_cj2ig",
            "pav:version": "1.0.0",
            "bibo:status": "bibo:published",
            "@context": {
              schema: "http://schema.org/",
              pav: "http://purl.org/pav/",
              xsd: "http://www.w3.org/2001/XMLSchema#",
              skos: "http://www.w3.org/2004/02/skos/core#",
              bibo: "http://purl.org/ontology/bibo/",
              oslc: "http://open-services.net/ns/core#",
              "schema:name": {
                "@type": "xsd:string",
              },
              "schema:description": {
                "@type": "xsd:string",
              },
              "pav:createdOn": {
                "@type": "xsd:dateTime",
              },
              "pav:createdBy": {
                "@type": "@id",
              },
              "pav:lastUpdatedOn": {
                "@type": "xsd:dateTime",
              },
              "oslc:modifiedBy": {
                "@type": "@id",
              },
              "skos:prefLabel": {
                "@type": "xsd:string",
              },
              "skos:altLabel": {
                "@type": "xsd:string",
              },
            },
            properties: {
              "@type": {
                oneOf: [
                  {
                    type: "string",
                    format: "uri",
                  },
                  {
                    type: "array",
                    minItems: 1,
                    items: {
                      type: "string",
                      format: "uri",
                    },
                    uniqueItems: true,
                  },
                ],
              },
              "rdfs:label": {
                type: [
                  "string",
                  "null",
                ],
              },
              "@value": {
                type: [
                  "string",
                  "null",
                ],
              },
            },
            additionalProperties: false,
            _valueConstraints: {
              literals: [
              ],
              requiredValue: false,
              multipleChoice: false,
            },
            "skos:prefLabel": "Name",
            "skos:altLabel": [
              "Name",
            ],
            _ui: {
              inputType: "textfield",
            },
            $schema: "http://json-schema.org/draft-04/schema#",
            _path: "IJC_Collaborator_contact_info.Name",
            _tmp: {
              nested: true,
            },
          },
          Email: {
            "@type": "https://schema.metadatacenter.org/core/TemplateField",
            "@context": {
              xsd: "http://www.w3.org/2001/XMLSchema#",
              pav: "http://purl.org/pav/",
              bibo: "http://purl.org/ontology/bibo/",
              oslc: "http://open-services.net/ns/core#",
              schema: "http://schema.org/",
              skos: "http://www.w3.org/2004/02/skos/core#",
              "schema:name": {
                "@type": "xsd:string",
              },
              "schema:description": {
                "@type": "xsd:string",
              },
              "skos:prefLabel": {
                "@type": "xsd:string",
              },
              "skos:altLabel": {
                "@type": "xsd:string",
              },
              "pav:createdOn": {
                "@type": "xsd:dateTime",
              },
              "pav:createdBy": {
                "@type": "@id",
              },
              "pav:lastUpdatedOn": {
                "@type": "xsd:dateTime",
              },
              "oslc:modifiedBy": {
                "@type": "@id",
              },
            },
            type: "object",
            title: "Email field schema",
            description: "Email field schema generated by the CEDAR Template Editor 2.6.62",
            _ui: {
              inputType: "email",
            },
            _valueConstraints: {
              requiredValue: false,
            },
            properties: {
              "@type": {
                oneOf: [
                  {
                    type: "string",
                    format: "uri",
                  },
                  {
                    type: "array",
                    minItems: 1,
                    items: {
                      type: "string",
                      format: "uri",
                    },
                    uniqueItems: true,
                  },
                ],
              },
              "@value": {
                type: [
                  "string",
                  "null",
                ],
              },
              "rdfs:label": {
                type: [
                  "string",
                  "null",
                ],
              },
            },
            required: [
              "@value",
            ],
            "schema:name": "Email",
            "schema:description": "",
            "pav:createdOn": "2024-11-08T02:37:08-08:00",
            "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
            "pav:lastUpdatedOn": "2024-11-08T02:37:08-08:00",
            "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
            "schema:schemaVersion": "1.6.0",
            additionalProperties: false,
            "skos:prefLabel": "Email",
            "@id": "https://repo.metadatacenter.org/template-fields/85ea1946-39ea-4905-85ee-2b28658033ac",
            $schema: "http://json-schema.org/draft-04/schema#",
            _path: "IJC_Collaborator_contact_info.Email",
            _tmp: {
              nested: true,
            },
          },
          "Principal_Investigator ORCID Text (10624734)": {
            "bibo:status": "bibo:published",
            "pav:version": "1.0.0",
            "@type": "https://schema.metadatacenter.org/core/TemplateField",
            "pav:createdOn": "2024-11-08T02:37:08-08:00",
            description: "'Principal_Investigator ORCID Text' field schema generated by the CEDAR Template Editor",
            type: "object",
            title: "'Principal_Investigator ORCID Text' field schema",
            "schema:schemaVersion": "1.6.0",
            "@context": {
              schema: "http://schema.org/",
              pav: "http://purl.org/pav/",
              xsd: "http://www.w3.org/2001/XMLSchema#",
              "pav:createdOn": {
                "@type": "xsd:dateTime",
              },
              skos: "http://www.w3.org/2004/02/skos/core#",
              oslc: "http://open-services.net/ns/core#",
              "skos:altLabel": {
                "@type": "xsd:string",
              },
              "pav:createdBy": {
                "@type": "@id",
              },
              "skos:prefLabel": {
                "@type": "xsd:string",
              },
              "schema:description": {
                "@type": "xsd:string",
              },
              "oslc:modifiedBy": {
                "@type": "@id",
              },
              "pav:lastUpdatedOn": {
                "@type": "xsd:dateTime",
              },
              bibo: "http://purl.org/ontology/bibo/",
              "schema:name": {
                "@type": "xsd:string",
              },
            },
            required: [
              "@value",
            ],
            "schema:identifier": "10624734",
            "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
            "skos:prefLabel": "ORCID",
            _ui: {
              inputType: "textfield",
            },
            _valueConstraints: {
              multipleChoice: false,
              maxLength: 255,
              requiredValue: false,
            },
            "schema:description": "A persistent unique digital identifier assigned to a principal investigator by the Open Researcher and Contributor ID (ORCID) organization.",
            "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
            "pav:lastUpdatedOn": "2024-11-08T02:37:08-08:00",
            "@id": "https://repo.metadatacenter.org/template-fields/86274eaa-cb94-4c68-b5f3-5f4d036a419a",
            additionalProperties: false,
            "schema:name": "Principal_Investigator ORCID Text (10624734)",
            properties: {
              "@type": {
                oneOf: [
                  {
                    format: "uri",
                    type: "string",
                  },
                  {
                    minItems: 1,
                    uniqueItems: true,
                    type: "array",
                    items: {
                      format: "uri",
                      type: "string",
                    },
                  },
                ],
              },
              "@value": {
                type: [
                  "string",
                  "null",
                ],
              },
            },
            $schema: "http://json-schema.org/draft-04/schema#",
            _path: "IJC_Collaborator_contact_info.Principal_Investigator ORCID Text (10624734)",
            _tmp: {
              nested: true,
            },
          },
          "IJC_institution-company": {
            "@id": "https://repo.metadatacenter.org/template-elements/914ece68-45aa-47d0-aa0b-f375ae56fa33",
            "@type": "https://schema.metadatacenter.org/core/TemplateElement",
            "@context": {
              xsd: "http://www.w3.org/2001/XMLSchema#",
              pav: "http://purl.org/pav/",
              bibo: "http://purl.org/ontology/bibo/",
              oslc: "http://open-services.net/ns/core#",
              schema: "http://schema.org/",
              "schema:name": {
                "@type": "xsd:string",
              },
              "schema:description": {
                "@type": "xsd:string",
              },
              "pav:createdOn": {
                "@type": "xsd:dateTime",
              },
              "pav:createdBy": {
                "@type": "@id",
              },
              "pav:lastUpdatedOn": {
                "@type": "xsd:dateTime",
              },
              "oslc:modifiedBy": {
                "@type": "@id",
              },
            },
            type: "object",
            title: "Ijc_institution-company element schema",
            description: "Ijc_institution-company element schema generated by the CEDAR Template Editor 2.6.62",
            _ui: {
              order: [
                "Name",
                "Address",
                "Country Name (3152016)",
              ],
              propertyLabels: {
                "Country Name (3152016)": "Country Name (3152016)",
                Name: "Name",
                Address: "Address",
              },
              propertyDescriptions: {
                "Country Name (3152016)": "Text name for a \"Country\", referring to a wide variety of dependencies, areas of special sovereignty, uninhabited islands, and other entities in addition to the traditional countries or independent states. (from CIA World Factbook 2002: http://www.cia.gov/cia/publications/factbook/docs/notesanddefs.html).",
                Name: "",
                Address: "",
              },
            },
            properties: {
              "@context": {
                type: "object",
                properties: {
                  "Country Name (3152016)": {
                    enum: [
                      "https://schema.metadatacenter.org/properties/a39768dc-6e98-4681-b9a2-ae3090679b33",
                    ],
                  },
                  Name: {
                    enum: [
                      "https://schema.metadatacenter.org/properties/d0398a63-37af-44bb-a1b6-ee37f7ddfc64",
                    ],
                  },
                  Address: {
                    enum: [
                      "https://schema.metadatacenter.org/properties/ee59a0c3-50e4-436a-b543-c760f4fd3261",
                    ],
                  },
                },
                additionalProperties: false,
                required: [
                  "Name",
                  "Address",
                  "Country Name (3152016)",
                ],
              },
              "@id": {
                type: "string",
                format: "uri",
              },
              "@type": {
                oneOf: [
                  {
                    type: "string",
                    format: "uri",
                  },
                  {
                    type: "array",
                    minItems: 1,
                    items: {
                      type: "string",
                      format: "uri",
                    },
                    uniqueItems: true,
                  },
                ],
              },
              "Country Name (3152016)": {
                "bibo:status": "bibo:published",
                "pav:version": "1.0.0",
                "@type": "https://schema.metadatacenter.org/core/TemplateField",
                "pav:createdOn": "2024-09-13T06:53:38-07:00",
                description: "The 'Country Name' field schema auto-generated by the CEDAR/CDE Tool",
                type: "object",
                title: "The 'Country Name' field schema",
                "schema:schemaVersion": "1.6.0",
                "@context": {
                  schema: "http://schema.org/",
                  pav: "http://purl.org/pav/",
                  xsd: "http://www.w3.org/2001/XMLSchema#",
                  "pav:createdOn": {
                    "@type": "xsd:dateTime",
                  },
                  skos: "http://www.w3.org/2004/02/skos/core#",
                  oslc: "http://open-services.net/ns/core#",
                  "skos:altLabel": {
                    "@type": "xsd:string",
                  },
                  "pav:createdBy": {
                    "@type": "@id",
                  },
                  "skos:prefLabel": {
                    "@type": "xsd:string",
                  },
                  "schema:description": {
                    "@type": "xsd:string",
                  },
                  "oslc:modifiedBy": {
                    "@type": "@id",
                  },
                  "pav:lastUpdatedOn": {
                    "@type": "xsd:dateTime",
                  },
                  bibo: "http://purl.org/ontology/bibo/",
                  "schema:name": {
                    "@type": "xsd:string",
                  },
                },
                "schema:identifier": "3152016",
                "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
                "skos:prefLabel": "Country",
                _ui: {
                  inputType: "textfield",
                },
                _valueConstraints: {
                  classes: [
                  ],
                  valueSets: [
                    {
                      name: "Country Name",
                      numTerms: 270,
                      vsCollection: "CADSR-VS",
                      uri: "https://cadsr.nci.nih.gov/metadata/CADSR-VS/VD3151957v1",
                    },
                  ],
                  multipleChoice: false,
                  branches: [
                  ],
                  maxLength: 40,
                  ontologies: [
                  ],
                  requiredValue: false,
                },
                "schema:description": "Text name for a \"Country\", referring to a wide variety of dependencies, areas of special sovereignty, uninhabited islands, and other entities in addition to the traditional countries or independent states. (from CIA World Factbook 2002: http://www.cia.gov/cia/publications/factbook/docs/notesanddefs.html).",
                "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
                "pav:lastUpdatedOn": "2024-09-13T06:53:38-07:00",
                "@id": "https://repo.metadatacenter.org/template-fields/80467df6-0183-48c4-820d-097995df0862",
                additionalProperties: false,
                "schema:name": "Country Name (3152016)",
                properties: {
                  "skos:notation": {
                    type: [
                      "string",
                      "null",
                    ],
                  },
                  "@id": {
                    format: "uri",
                    type: "string",
                  },
                  "rdfs:label": {
                    type: [
                      "string",
                      "null",
                    ],
                  },
                  "@type": {
                    oneOf: [
                      {
                        format: "uri",
                        type: "string",
                      },
                      {
                        minItems: 1,
                        uniqueItems: true,
                        type: "array",
                        items: {
                          format: "uri",
                          type: "string",
                        },
                      },
                    ],
                  },
                },
                $schema: "http://json-schema.org/draft-04/schema#",
                _path: "IJC_Collaborator_contact_info.IJC_institution-company.Country Name (3152016)",
                _tmp: {
                  nested: true,
                },
              },
              Name: {
                "@type": "https://schema.metadatacenter.org/core/TemplateField",
                "@context": {
                  xsd: "http://www.w3.org/2001/XMLSchema#",
                  pav: "http://purl.org/pav/",
                  bibo: "http://purl.org/ontology/bibo/",
                  oslc: "http://open-services.net/ns/core#",
                  schema: "http://schema.org/",
                  skos: "http://www.w3.org/2004/02/skos/core#",
                  "schema:name": {
                    "@type": "xsd:string",
                  },
                  "schema:description": {
                    "@type": "xsd:string",
                  },
                  "skos:prefLabel": {
                    "@type": "xsd:string",
                  },
                  "skos:altLabel": {
                    "@type": "xsd:string",
                  },
                  "pav:createdOn": {
                    "@type": "xsd:dateTime",
                  },
                  "pav:createdBy": {
                    "@type": "@id",
                  },
                  "pav:lastUpdatedOn": {
                    "@type": "xsd:dateTime",
                  },
                  "oslc:modifiedBy": {
                    "@type": "@id",
                  },
                },
                type: "object",
                title: "Name field schema",
                description: "Name field schema generated by the CEDAR Template Editor 2.6.62",
                _ui: {
                  inputType: "textfield",
                },
                _valueConstraints: {
                  requiredValue: false,
                },
                properties: {
                  "@type": {
                    oneOf: [
                      {
                        type: "string",
                        format: "uri",
                      },
                      {
                        type: "array",
                        minItems: 1,
                        items: {
                          type: "string",
                          format: "uri",
                        },
                        uniqueItems: true,
                      },
                    ],
                  },
                  "@value": {
                    type: [
                      "string",
                      "null",
                    ],
                  },
                  "rdfs:label": {
                    type: [
                      "string",
                      "null",
                    ],
                  },
                },
                required: [
                  "@value",
                ],
                "schema:name": "Name",
                "schema:description": "",
                "pav:createdOn": "2024-09-13T06:53:38-07:00",
                "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
                "pav:lastUpdatedOn": "2024-09-13T06:53:38-07:00",
                "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
                "schema:schemaVersion": "1.6.0",
                additionalProperties: false,
                "skos:prefLabel": "Name",
                "@id": "https://repo.metadatacenter.org/template-fields/c4045675-178d-4dc2-b5ba-5c2c3b49a0c4",
                $schema: "http://json-schema.org/draft-04/schema#",
                _path: "IJC_Collaborator_contact_info.IJC_institution-company.Name",
                _tmp: {
                  nested: true,
                },
              },
              Address: {
                "@type": "https://schema.metadatacenter.org/core/TemplateField",
                "@context": {
                  xsd: "http://www.w3.org/2001/XMLSchema#",
                  pav: "http://purl.org/pav/",
                  bibo: "http://purl.org/ontology/bibo/",
                  oslc: "http://open-services.net/ns/core#",
                  schema: "http://schema.org/",
                  skos: "http://www.w3.org/2004/02/skos/core#",
                  "schema:name": {
                    "@type": "xsd:string",
                  },
                  "schema:description": {
                    "@type": "xsd:string",
                  },
                  "skos:prefLabel": {
                    "@type": "xsd:string",
                  },
                  "skos:altLabel": {
                    "@type": "xsd:string",
                  },
                  "pav:createdOn": {
                    "@type": "xsd:dateTime",
                  },
                  "pav:createdBy": {
                    "@type": "@id",
                  },
                  "pav:lastUpdatedOn": {
                    "@type": "xsd:dateTime",
                  },
                  "oslc:modifiedBy": {
                    "@type": "@id",
                  },
                },
                type: "object",
                title: "Address field schema",
                description: "Address field schema generated by the CEDAR Template Editor 2.6.62",
                _ui: {
                  inputType: "textfield",
                },
                _valueConstraints: {
                  requiredValue: false,
                },
                properties: {
                  "@type": {
                    oneOf: [
                      {
                        type: "string",
                        format: "uri",
                      },
                      {
                        type: "array",
                        minItems: 1,
                        items: {
                          type: "string",
                          format: "uri",
                        },
                        uniqueItems: true,
                      },
                    ],
                  },
                  "@value": {
                    type: [
                      "string",
                      "null",
                    ],
                  },
                  "rdfs:label": {
                    type: [
                      "string",
                      "null",
                    ],
                  },
                },
                required: [
                  "@value",
                ],
                "schema:name": "Address",
                "schema:description": "",
                "pav:createdOn": "2024-09-13T06:53:38-07:00",
                "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
                "pav:lastUpdatedOn": "2024-09-13T06:53:38-07:00",
                "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
                "schema:schemaVersion": "1.6.0",
                additionalProperties: false,
                "skos:prefLabel": "Address",
                "@id": "https://repo.metadatacenter.org/template-fields/9eb1175b-4ef6-470c-aff0-93ac7d52312c",
                $schema: "http://json-schema.org/draft-04/schema#",
                _path: "IJC_Collaborator_contact_info.IJC_institution-company.Address",
                _tmp: {
                  nested: true,
                },
              },
            },
            "schema:name": "IJC_institution-company",
            "schema:description": "",
            required: [
              "@context",
              "@id",
              "Name",
              "Address",
              "Country Name (3152016)",
            ],
            "pav:createdOn": "2024-11-08T02:37:08-08:00",
            "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
            "pav:lastUpdatedOn": "2024-11-08T02:37:08-08:00",
            "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
            "schema:schemaVersion": "1.6.0",
            additionalProperties: false,
            "pav:version": "0.0.1",
            "bibo:status": "bibo:draft",
            "skos:prefLabel": "Institution / Company",
            $schema: "http://json-schema.org/draft-04/schema#",
            _tmp: {
              nested: true,
            },
          },
        },
        "schema:name": "IJC_Collaborator_contact_info",
        "schema:description": "",
        required: [
          "@context",
          "@id",
          "Name",
          "Email",
          "Principal_Investigator ORCID Text (10624734)",
          "IJC_institution-company",
        ],
        "pav:createdOn": "2024-11-20T03:41:09-08:00",
        "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
        "pav:lastUpdatedOn": "2024-11-20T03:41:09-08:00",
        "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
        "schema:schemaVersion": "1.6.0",
        additionalProperties: false,
        "pav:version": "0.0.1",
        "bibo:status": "bibo:draft",
        $schema: "http://json-schema.org/draft-04/schema#",
      },
      "Project Name": {
        "@type": "https://schema.metadatacenter.org/core/TemplateField",
        "@context": {
          xsd: "http://www.w3.org/2001/XMLSchema#",
          pav: "http://purl.org/pav/",
          bibo: "http://purl.org/ontology/bibo/",
          oslc: "http://open-services.net/ns/core#",
          schema: "http://schema.org/",
          skos: "http://www.w3.org/2004/02/skos/core#",
          "schema:name": {
            "@type": "xsd:string",
          },
          "schema:description": {
            "@type": "xsd:string",
          },
          "skos:prefLabel": {
            "@type": "xsd:string",
          },
          "skos:altLabel": {
            "@type": "xsd:string",
          },
          "pav:createdOn": {
            "@type": "xsd:dateTime",
          },
          "pav:createdBy": {
            "@type": "@id",
          },
          "pav:lastUpdatedOn": {
            "@type": "xsd:dateTime",
          },
          "oslc:modifiedBy": {
            "@type": "@id",
          },
        },
        type: "object",
        title: "Project Name field schema",
        description: "Project Name field schema generated by the CEDAR Template Editor 2.6.62",
        _ui: {
          inputType: "textfield",
        },
        _valueConstraints: {
          requiredValue: true,
        },
        properties: {
          "@type": {
            oneOf: [
              {
                type: "string",
                format: "uri",
              },
              {
                type: "array",
                minItems: 1,
                items: {
                  type: "string",
                  format: "uri",
                },
                uniqueItems: true,
              },
            ],
          },
          "@value": {
            type: [
              "string",
              "null",
            ],
          },
          "rdfs:label": {
            type: [
              "string",
              "null",
            ],
          },
        },
        required: [
          "@value",
        ],
        "schema:name": "Project Name",
        "schema:description": "",
        "pav:createdOn": "2024-11-20T03:41:09-08:00",
        "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
        "pav:lastUpdatedOn": "2024-11-20T03:41:09-08:00",
        "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
        "schema:schemaVersion": "1.6.0",
        additionalProperties: false,
        "skos:prefLabel": "Project Name",
        "@id": "https://repo.metadatacenter.org/template-fields/f843eec4-a215-4661-a28e-c319b9db0c64",
        $schema: "http://json-schema.org/draft-04/schema#",
        _path: "Project Name",
      },
      Consortium: {
        "@type": "https://schema.metadatacenter.org/core/TemplateField",
        "@context": {
          xsd: "http://www.w3.org/2001/XMLSchema#",
          pav: "http://purl.org/pav/",
          bibo: "http://purl.org/ontology/bibo/",
          oslc: "http://open-services.net/ns/core#",
          schema: "http://schema.org/",
          skos: "http://www.w3.org/2004/02/skos/core#",
          "schema:name": {
            "@type": "xsd:string",
          },
          "schema:description": {
            "@type": "xsd:string",
          },
          "skos:prefLabel": {
            "@type": "xsd:string",
          },
          "skos:altLabel": {
            "@type": "xsd:string",
          },
          "pav:createdOn": {
            "@type": "xsd:dateTime",
          },
          "pav:createdBy": {
            "@type": "@id",
          },
          "pav:lastUpdatedOn": {
            "@type": "xsd:dateTime",
          },
          "oslc:modifiedBy": {
            "@type": "@id",
          },
        },
        type: "object",
        title: "Consortium field schema",
        description: "Consortium field schema generated by the CEDAR Template Editor 2.6.62",
        _ui: {
          inputType: "textfield",
        },
        _valueConstraints: {
          requiredValue: false,
        },
        properties: {
          "@type": {
            oneOf: [
              {
                type: "string",
                format: "uri",
              },
              {
                type: "array",
                minItems: 1,
                items: {
                  type: "string",
                  format: "uri",
                },
                uniqueItems: true,
              },
            ],
          },
          "@value": {
            type: [
              "string",
              "null",
            ],
          },
          "rdfs:label": {
            type: [
              "string",
              "null",
            ],
          },
        },
        required: [
          "@value",
        ],
        "schema:name": "Consortium",
        "schema:description": "If the Project is part of a Consortium, please specify",
        "pav:createdOn": "2024-11-20T03:41:09-08:00",
        "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
        "pav:lastUpdatedOn": "2024-11-20T03:41:09-08:00",
        "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
        "schema:schemaVersion": "1.6.0",
        additionalProperties: false,
        "skos:prefLabel": "Consortium",
        "@id": "https://repo.metadatacenter.org/template-fields/849a712c-d12d-47fc-aca9-19306619f6e6",
        $schema: "http://json-schema.org/draft-04/schema#",
        _path: "Consortium",
      },
      IJC_sample_metadata: {
        type: "array",
        "pav:derivedFrom": "https://repo.metadatacenter.org/template-elements/8001ce62-ffa1-4bba-84cb-5aabb20368fc",
        minItems: 1,
        items: {
          "@type": "https://schema.metadatacenter.org/core/TemplateElement",
          "@context": {
            xsd: "http://www.w3.org/2001/XMLSchema#",
            pav: "http://purl.org/pav/",
            bibo: "http://purl.org/ontology/bibo/",
            oslc: "http://open-services.net/ns/core#",
            schema: "http://schema.org/",
            "schema:name": {
              "@type": "xsd:string",
            },
            "schema:description": {
              "@type": "xsd:string",
            },
            "pav:createdOn": {
              "@type": "xsd:dateTime",
            },
            "pav:createdBy": {
              "@type": "@id",
            },
            "pav:lastUpdatedOn": {
              "@type": "xsd:dateTime",
            },
            "oslc:modifiedBy": {
              "@type": "@id",
            },
          },
          type: "object",
          title: "Samples element schema",
          description: "Samples element schema generated by the CEDAR Template Editor 2.7.1",
          _ui: {
            order: [
              "Sample name",
              "Sample Provider",
              "Cell Line Name",
              "Species",
              "Other species",
              "Sex",
              "Age value",
              "Age unit",
              "Development stage",
              "Sample origin",
              "Celltype",
              "Primary culture",
              "Disease",
              "Tumor",
              "Tumor subtype",
              "Control",
              "Treatement",
              "Treatment specify",
              "Patient clinical data available",
              "Patient survival data available",
              "Sample preservation",
              "DNA concentration measure technology",
              "Notes",
            ],
            propertyLabels: {
              Tumor: "Tumor",
              Control: "Control",
              Disease: "Disease",
              "Primary culture": "Primary culture",
              "Sample Provider": "Sample Provider",
              "Other species": "Other species",
              Sex: "Sex",
              "Development stage": "Development stage",
              "Sample origin": "Sample origin",
              Celltype: "Celltype",
              "Treatment specify": "Treatment specify",
              "Cell Line Name": "Cell Line Name",
              "Tumor subtype": "Tumor subtype",
              Treatement: "Treatement",
              "Patient clinical data available": "Patient clinical data available",
              "Patient survival data available": "Patient survival data available",
              "Sample name": "Sample name",
              "Sample preservation": "Sample preservation",
              "DNA concentration measure technology": "DNA concentration measure technology",
              Notes: "Notes",
              Species: "Species",
              "Age value": "Age value",
              "Age unit": "Age unit",
            },
            propertyDescriptions: {
              "730bc1d0-7d4c-4a0c-b26a-4c87126aa3ee": "",
              Age: "",
              Organ: "",
              Tumor: "",
              Control: "",
              Disease: "",
              Phenotype: "",
              "Sample Preservation Method": "",
              "Cell Line Name": "",
              "Cell Line Source": "",
              "Primary culture": "",
              "Sample Provider": "",
              Species: "",
              "Other species": "Fill in case you have selected \"Other\" as species",
              Sex: "",
              "Development stage": "",
              "Sample origin": "",
              Celltype: "",
              "Treatment specify": "",
              "Tumor subtype": "Morphological type",
              Treatemetn: "",
              Notes: "",
              Treatement: "",
              "Patient clinical data available": "",
              "Patient survival data available": "",
              Age1: "",
              Age2: "",
              "Sample name": "",
              "Sample preservation": "",
              "DNA concentration measure technology": "",
              "Age value": "",
              "Age unit": "",
            },
          },
          properties: {
            "@context": {
              type: "object",
              properties: {
                Tumor: {
                  enum: [
                    "https://schema.metadatacenter.org/properties/08afe47d-d9fc-4290-aff3-d2fcb3873f92",
                  ],
                },
                Control: {
                  enum: [
                    "https://schema.metadatacenter.org/properties/4767ed7e-d048-4941-8e4e-8d945729a243",
                  ],
                },
                Disease: {
                  enum: [
                    "https://schema.metadatacenter.org/properties/51bcb11f-e124-45fc-bcca-82899f4d68f3",
                  ],
                },
                "Primary culture": {
                  enum: [
                    "https://schema.metadatacenter.org/properties/5454767d-c051-4108-9930-3ff3955918f8",
                  ],
                },
                "Sample Provider": {
                  enum: [
                    "https://schema.metadatacenter.org/properties/88647f3a-d381-4f6c-bb42-ad82ed669760",
                  ],
                },
                "Other species": {
                  enum: [
                    "https://schema.metadatacenter.org/properties/70cc6996-0a8f-44c6-9d49-f935d221cd00",
                  ],
                },
                Sex: {
                  enum: [
                    "https://schema.metadatacenter.org/properties/9da9f3d4-8067-4e70-a3f0-191bcf472101",
                  ],
                },
                "Development stage": {
                  enum: [
                    "https://schema.metadatacenter.org/properties/7291a2b8-46b5-40d2-b133-3c390eee524d",
                  ],
                },
                "Sample origin": {
                  enum: [
                    "https://schema.metadatacenter.org/properties/47a9e48a-489a-473b-a08a-211ca95cc71a",
                  ],
                },
                Celltype: {
                  enum: [
                    "https://schema.metadatacenter.org/properties/6d2cd38e-5154-49d7-8c5d-b392cc2399a1",
                  ],
                },
                "Treatment specify": {
                  enum: [
                    "https://schema.metadatacenter.org/properties/4325e81c-52eb-4a5b-b976-f2ff76ebf8e0",
                  ],
                },
                "Cell Line Name": {
                  enum: [
                    "https://schema.metadatacenter.org/properties/5dc4dbdf-888d-444f-b81f-e2376bb4f256",
                  ],
                },
                "Tumor subtype": {
                  enum: [
                    "https://schema.metadatacenter.org/properties/11e5c598-dfa1-4683-a46b-0d729f9c6d50",
                  ],
                },
                Treatement: {
                  enum: [
                    "https://schema.metadatacenter.org/properties/e1979247-df90-45f3-a69d-253d14c12500",
                  ],
                },
                "Patient clinical data available": {
                  enum: [
                    "https://schema.metadatacenter.org/properties/d5d85810-861d-4796-bcf6-be601cb8a054",
                  ],
                },
                "Patient survival data available": {
                  enum: [
                    "https://schema.metadatacenter.org/properties/bc6ea875-b1fc-4a57-ac3e-dab0158b22c7",
                  ],
                },
                "Sample name": {
                  enum: [
                    "https://schema.metadatacenter.org/properties/21be2752-1b07-48cb-8e57-3bcdf2b38071",
                  ],
                },
                "Sample preservation": {
                  enum: [
                    "https://schema.metadatacenter.org/properties/6c9337ac-bde5-4822-a6b5-f16da380f53d",
                  ],
                },
                "DNA concentration measure technology": {
                  enum: [
                    "https://schema.metadatacenter.org/properties/13744bf3-a684-4da7-be49-d6f9e1850c3a",
                  ],
                },
                Notes: {
                  enum: [
                    "https://schema.metadatacenter.org/properties/23f5d351-7f22-45f3-883a-38f62c7d4b47",
                  ],
                },
                Species: {
                  enum: [
                    "https://schema.metadatacenter.org/properties/d2e521c3-4a09-4837-a023-bb2f161a0afa",
                  ],
                },
                "Age value": {
                  enum: [
                    "https://schema.metadatacenter.org/properties/4e4900c7-a23a-4f90-b8d9-f25d9262dcb6",
                  ],
                },
                "Age unit": {
                  enum: [
                    "https://schema.metadatacenter.org/properties/e933f973-7fcb-4c87-bbdd-71ba96c93abd",
                  ],
                },
              },
              additionalProperties: false,
              required: [
                "Sample name",
                "Sample Provider",
                "Sex",
                "Sample origin",
                "Celltype",
                "Tumor",
                "Control",
                "Disease",
                "Treatment specify",
                "Primary culture",
                "Cell Line Name",
                "Other species",
                "Development stage",
                "Tumor subtype",
                "Treatement",
                "Patient clinical data available",
                "Patient survival data available",
                "Sample preservation",
                "DNA concentration measure technology",
                "Notes",
                "Species",
                "Age value",
                "Age unit",
              ],
            },
            "@id": {
              type: "string",
              format: "uri",
            },
            "@type": {
              oneOf: [
                {
                  type: "string",
                  format: "uri",
                },
                {
                  type: "array",
                  minItems: 1,
                  items: {
                    type: "string",
                    format: "uri",
                  },
                  uniqueItems: true,
                },
              ],
            },
            Tumor: {
              "@type": "https://schema.metadatacenter.org/core/TemplateField",
              "@context": {
                xsd: "http://www.w3.org/2001/XMLSchema#",
                pav: "http://purl.org/pav/",
                bibo: "http://purl.org/ontology/bibo/",
                oslc: "http://open-services.net/ns/core#",
                schema: "http://schema.org/",
                skos: "http://www.w3.org/2004/02/skos/core#",
                "schema:name": {
                  "@type": "xsd:string",
                },
                "schema:description": {
                  "@type": "xsd:string",
                },
                "skos:prefLabel": {
                  "@type": "xsd:string",
                },
                "skos:altLabel": {
                  "@type": "xsd:string",
                },
                "pav:createdOn": {
                  "@type": "xsd:dateTime",
                },
                "pav:createdBy": {
                  "@type": "@id",
                },
                "pav:lastUpdatedOn": {
                  "@type": "xsd:dateTime",
                },
                "oslc:modifiedBy": {
                  "@type": "@id",
                },
              },
              type: "object",
              title: "Tumor field schema",
              description: "Tumor field schema generated by the CEDAR Template Editor 2.6.62",
              _ui: {
                inputType: "list",
              },
              _valueConstraints: {
                requiredValue: true,
                multipleChoice: false,
                literals: [
                  {
                    label: "Primary",
                  },
                  {
                    label: "Metastasis",
                  },
                  {
                    label: "Unknown",
                  },
                  {
                    label: "No tumor",
                  },
                ],
              },
              properties: {
                "@type": {
                  oneOf: [
                    {
                      type: "string",
                      format: "uri",
                    },
                    {
                      type: "array",
                      minItems: 1,
                      items: {
                        type: "string",
                        format: "uri",
                      },
                      uniqueItems: true,
                    },
                  ],
                },
                "@value": {
                  type: [
                    "string",
                    "null",
                  ],
                },
                "rdfs:label": {
                  type: [
                    "string",
                    "null",
                  ],
                },
              },
              required: [
                "@value",
              ],
              "schema:name": "Tumor",
              "schema:description": "",
              "pav:createdOn": "2024-11-20T03:41:06-08:00",
              "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "pav:lastUpdatedOn": "2024-11-20T03:41:06-08:00",
              "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "schema:schemaVersion": "1.6.0",
              additionalProperties: false,
              "skos:prefLabel": "Tumor",
              "@id": "https://repo.metadatacenter.org/template-fields/770cb922-c29b-48eb-914a-85fb71bf2041",
              $schema: "http://json-schema.org/draft-04/schema#",
              _path: "IJC_sample_metadata.Tumor",
              _tmp: {
                nested: true,
              },
            },
            Control: {
              "@type": "https://schema.metadatacenter.org/core/TemplateField",
              "@context": {
                xsd: "http://www.w3.org/2001/XMLSchema#",
                pav: "http://purl.org/pav/",
                bibo: "http://purl.org/ontology/bibo/",
                oslc: "http://open-services.net/ns/core#",
                schema: "http://schema.org/",
                skos: "http://www.w3.org/2004/02/skos/core#",
                "schema:name": {
                  "@type": "xsd:string",
                },
                "schema:description": {
                  "@type": "xsd:string",
                },
                "skos:prefLabel": {
                  "@type": "xsd:string",
                },
                "skos:altLabel": {
                  "@type": "xsd:string",
                },
                "pav:createdOn": {
                  "@type": "xsd:dateTime",
                },
                "pav:createdBy": {
                  "@type": "@id",
                },
                "pav:lastUpdatedOn": {
                  "@type": "xsd:dateTime",
                },
                "oslc:modifiedBy": {
                  "@type": "@id",
                },
              },
              type: "object",
              title: "Control field schema",
              description: "Control field schema generated by the CEDAR Template Editor 2.6.62",
              _ui: {
                inputType: "radio",
              },
              _valueConstraints: {
                requiredValue: true,
                multipleChoice: false,
                literals: [
                  {
                    label: "Yes",
                    $$hashKey: "object:521",
                  },
                  {
                    label: "No",
                    $$hashKey: "object:522",
                  },
                ],
              },
              properties: {
                "@type": {
                  oneOf: [
                    {
                      type: "string",
                      format: "uri",
                    },
                    {
                      type: "array",
                      minItems: 1,
                      items: {
                        type: "string",
                        format: "uri",
                      },
                      uniqueItems: true,
                    },
                  ],
                },
                "@value": {
                  type: [
                    "string",
                    "null",
                  ],
                },
                "rdfs:label": {
                  type: [
                    "string",
                    "null",
                  ],
                },
              },
              required: [
                "@value",
              ],
              "schema:name": "Control",
              "schema:description": "",
              "pav:createdOn": "2024-11-20T03:41:06-08:00",
              "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "pav:lastUpdatedOn": "2024-11-20T03:41:06-08:00",
              "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "schema:schemaVersion": "1.6.0",
              additionalProperties: false,
              "skos:prefLabel": "Control",
              "@id": "https://repo.metadatacenter.org/template-fields/95dff0c6-fdc4-431c-8af4-433240087ca1",
              $schema: "http://json-schema.org/draft-04/schema#",
              _path: "IJC_sample_metadata.Control",
              _tmp: {
                nested: true,
              },
            },
            Disease: {
              "@type": "https://schema.metadatacenter.org/core/TemplateField",
              "@context": {
                xsd: "http://www.w3.org/2001/XMLSchema#",
                pav: "http://purl.org/pav/",
                bibo: "http://purl.org/ontology/bibo/",
                oslc: "http://open-services.net/ns/core#",
                schema: "http://schema.org/",
                skos: "http://www.w3.org/2004/02/skos/core#",
                "schema:name": {
                  "@type": "xsd:string",
                },
                "schema:description": {
                  "@type": "xsd:string",
                },
                "skos:prefLabel": {
                  "@type": "xsd:string",
                },
                "skos:altLabel": {
                  "@type": "xsd:string",
                },
                "pav:createdOn": {
                  "@type": "xsd:dateTime",
                },
                "pav:createdBy": {
                  "@type": "@id",
                },
                "pav:lastUpdatedOn": {
                  "@type": "xsd:dateTime",
                },
                "oslc:modifiedBy": {
                  "@type": "@id",
                },
              },
              type: "object",
              title: "Disease field schema",
              description: "Disease field schema generated by the CEDAR Template Editor 2.6.62",
              _ui: {
                inputType: "textfield",
                valueRecommendationEnabled: true,
              },
              _valueConstraints: {
                requiredValue: false,
                ontologies: [
                ],
                valueSets: [
                ],
                classes: [
                ],
                branches: [
                  {
                    source: "Human Disease Ontology (DOID)",
                    acronym: "DOID",
                    uri: "http://purl.obolibrary.org/obo/DOID_4",
                    name: "disease",
                    maxDepth: 0,
                  },
                ],
                multipleChoice: false,
              },
              properties: {
                "@type": {
                  oneOf: [
                    {
                      type: "string",
                      format: "uri",
                    },
                    {
                      type: "array",
                      minItems: 1,
                      items: {
                        type: "string",
                        format: "uri",
                      },
                      uniqueItems: true,
                    },
                  ],
                },
                "rdfs:label": {
                  type: [
                    "string",
                    "null",
                  ],
                },
                "@id": {
                  type: "string",
                  format: "uri",
                },
              },
              "schema:name": "Disease",
              "schema:description": "",
              "pav:createdOn": "2024-11-20T03:41:06-08:00",
              "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "pav:lastUpdatedOn": "2024-11-20T03:41:06-08:00",
              "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "schema:schemaVersion": "1.6.0",
              additionalProperties: false,
              "skos:prefLabel": "Disease",
              "@id": "https://repo.metadatacenter.org/template-fields/12568f68-27d2-437a-8681-9edd767647d0",
              $schema: "http://json-schema.org/draft-04/schema#",
              _path: "IJC_sample_metadata.Disease",
              _tmp: {
                nested: true,
              },
            },
            "Primary culture": {
              "@type": "https://schema.metadatacenter.org/core/TemplateField",
              "@context": {
                xsd: "http://www.w3.org/2001/XMLSchema#",
                pav: "http://purl.org/pav/",
                bibo: "http://purl.org/ontology/bibo/",
                oslc: "http://open-services.net/ns/core#",
                schema: "http://schema.org/",
                skos: "http://www.w3.org/2004/02/skos/core#",
                "schema:name": {
                  "@type": "xsd:string",
                },
                "schema:description": {
                  "@type": "xsd:string",
                },
                "skos:prefLabel": {
                  "@type": "xsd:string",
                },
                "skos:altLabel": {
                  "@type": "xsd:string",
                },
                "pav:createdOn": {
                  "@type": "xsd:dateTime",
                },
                "pav:createdBy": {
                  "@type": "@id",
                },
                "pav:lastUpdatedOn": {
                  "@type": "xsd:dateTime",
                },
                "oslc:modifiedBy": {
                  "@type": "@id",
                },
              },
              type: "object",
              title: "Primary culture field schema",
              description: "Primary culture field schema generated by the CEDAR Template Editor 2.6.62",
              _ui: {
                inputType: "radio",
              },
              _valueConstraints: {
                requiredValue: false,
                multipleChoice: false,
                literals: [
                  {
                    label: "yes",
                    $$hashKey: "object:516",
                  },
                  {
                    label: "no",
                    $$hashKey: "object:517",
                  },
                ],
              },
              properties: {
                "@type": {
                  oneOf: [
                    {
                      type: "string",
                      format: "uri",
                    },
                    {
                      type: "array",
                      minItems: 1,
                      items: {
                        type: "string",
                        format: "uri",
                      },
                      uniqueItems: true,
                    },
                  ],
                },
                "@value": {
                  type: [
                    "string",
                    "null",
                  ],
                },
                "rdfs:label": {
                  type: [
                    "string",
                    "null",
                  ],
                },
              },
              required: [
                "@value",
              ],
              "schema:name": "Primary culture",
              "schema:description": "",
              "pav:createdOn": "2024-11-20T03:41:06-08:00",
              "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "pav:lastUpdatedOn": "2024-11-20T03:41:06-08:00",
              "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "schema:schemaVersion": "1.6.0",
              additionalProperties: false,
              "@id": "https://repo.metadatacenter.org/template-fields/53fc77ae-c0d2-4cd5-8c66-11e2e45e22de",
              $schema: "http://json-schema.org/draft-04/schema#",
              _path: "IJC_sample_metadata.Primary culture",
              _tmp: {
                nested: true,
              },
            },
            "Sample Provider": {
              "@type": "https://schema.metadatacenter.org/core/TemplateField",
              "@context": {
                xsd: "http://www.w3.org/2001/XMLSchema#",
                pav: "http://purl.org/pav/",
                bibo: "http://purl.org/ontology/bibo/",
                oslc: "http://open-services.net/ns/core#",
                schema: "http://schema.org/",
                skos: "http://www.w3.org/2004/02/skos/core#",
                "schema:name": {
                  "@type": "xsd:string",
                },
                "schema:description": {
                  "@type": "xsd:string",
                },
                "skos:prefLabel": {
                  "@type": "xsd:string",
                },
                "skos:altLabel": {
                  "@type": "xsd:string",
                },
                "pav:createdOn": {
                  "@type": "xsd:dateTime",
                },
                "pav:createdBy": {
                  "@type": "@id",
                },
                "pav:lastUpdatedOn": {
                  "@type": "xsd:dateTime",
                },
                "oslc:modifiedBy": {
                  "@type": "@id",
                },
              },
              type: "object",
              title: "Sample Provider field schema",
              description: "Sample Provider field schema generated by the CEDAR Template Editor 2.6.62",
              _ui: {
                inputType: "textfield",
              },
              _valueConstraints: {
                requiredValue: false,
              },
              properties: {
                "@type": {
                  oneOf: [
                    {
                      type: "string",
                      format: "uri",
                    },
                    {
                      type: "array",
                      minItems: 1,
                      items: {
                        type: "string",
                        format: "uri",
                      },
                      uniqueItems: true,
                    },
                  ],
                },
                "@value": {
                  type: [
                    "string",
                    "null",
                  ],
                },
                "rdfs:label": {
                  type: [
                    "string",
                    "null",
                  ],
                },
              },
              required: [
                "@value",
              ],
              "schema:name": "Sample Provider",
              "schema:description": "",
              "pav:createdOn": "2024-11-20T03:41:06-08:00",
              "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "pav:lastUpdatedOn": "2024-11-20T03:41:06-08:00",
              "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "schema:schemaVersion": "1.6.0",
              additionalProperties: false,
              "skos:prefLabel": "Sample Provider",
              "@id": "https://repo.metadatacenter.org/template-fields/da3d10f5-0508-4e78-b244-1b127cae4756",
              $schema: "http://json-schema.org/draft-04/schema#",
              _path: "IJC_sample_metadata.Sample Provider",
              _tmp: {
                nested: true,
              },
            },
            "Other species": {
              "@type": "https://schema.metadatacenter.org/core/TemplateField",
              "@context": {
                xsd: "http://www.w3.org/2001/XMLSchema#",
                pav: "http://purl.org/pav/",
                bibo: "http://purl.org/ontology/bibo/",
                oslc: "http://open-services.net/ns/core#",
                schema: "http://schema.org/",
                skos: "http://www.w3.org/2004/02/skos/core#",
                "schema:name": {
                  "@type": "xsd:string",
                },
                "schema:description": {
                  "@type": "xsd:string",
                },
                "skos:prefLabel": {
                  "@type": "xsd:string",
                },
                "skos:altLabel": {
                  "@type": "xsd:string",
                },
                "pav:createdOn": {
                  "@type": "xsd:dateTime",
                },
                "pav:createdBy": {
                  "@type": "@id",
                },
                "pav:lastUpdatedOn": {
                  "@type": "xsd:dateTime",
                },
                "oslc:modifiedBy": {
                  "@type": "@id",
                },
              },
              type: "object",
              title: "Other species field schema",
              description: "Other species field schema generated by the CEDAR Template Editor 2.6.62",
              _ui: {
                inputType: "textfield",
              },
              _valueConstraints: {
                requiredValue: false,
              },
              properties: {
                "@type": {
                  oneOf: [
                    {
                      type: "string",
                      format: "uri",
                    },
                    {
                      type: "array",
                      minItems: 1,
                      items: {
                        type: "string",
                        format: "uri",
                      },
                      uniqueItems: true,
                    },
                  ],
                },
                "@value": {
                  type: [
                    "string",
                    "null",
                  ],
                },
                "rdfs:label": {
                  type: [
                    "string",
                    "null",
                  ],
                },
              },
              required: [
                "@value",
              ],
              "schema:name": "Other species",
              "schema:description": "Fill in case you have selected \"Other\" as species",
              "pav:createdOn": "2024-11-20T03:41:06-08:00",
              "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "pav:lastUpdatedOn": "2024-11-20T03:41:06-08:00",
              "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "schema:schemaVersion": "1.6.0",
              additionalProperties: false,
              "skos:prefLabel": "Other species",
              "@id": "https://repo.metadatacenter.org/template-fields/bd4d5911-dd78-42d7-80bf-26eaea753f43",
              $schema: "http://json-schema.org/draft-04/schema#",
              _path: "IJC_sample_metadata.Other species",
              _tmp: {
                nested: true,
              },
            },
            Sex: {
              "@type": "https://schema.metadatacenter.org/core/TemplateField",
              "@context": {
                xsd: "http://www.w3.org/2001/XMLSchema#",
                pav: "http://purl.org/pav/",
                bibo: "http://purl.org/ontology/bibo/",
                oslc: "http://open-services.net/ns/core#",
                schema: "http://schema.org/",
                skos: "http://www.w3.org/2004/02/skos/core#",
                "schema:name": {
                  "@type": "xsd:string",
                },
                "schema:description": {
                  "@type": "xsd:string",
                },
                "skos:prefLabel": {
                  "@type": "xsd:string",
                },
                "skos:altLabel": {
                  "@type": "xsd:string",
                },
                "pav:createdOn": {
                  "@type": "xsd:dateTime",
                },
                "pav:createdBy": {
                  "@type": "@id",
                },
                "pav:lastUpdatedOn": {
                  "@type": "xsd:dateTime",
                },
                "oslc:modifiedBy": {
                  "@type": "@id",
                },
              },
              type: "object",
              title: "Sex field schema",
              description: "Sex field schema generated by the CEDAR Template Editor 2.6.62",
              _ui: {
                inputType: "list",
              },
              _valueConstraints: {
                requiredValue: true,
                multipleChoice: false,
                literals: [
                  {
                    label: "Female",
                  },
                  {
                    label: "Male",
                  },
                  {
                    label: "Unknown",
                  },
                  {
                    label: "Other",
                  },
                ],
              },
              properties: {
                "@type": {
                  oneOf: [
                    {
                      type: "string",
                      format: "uri",
                    },
                    {
                      type: "array",
                      minItems: 1,
                      items: {
                        type: "string",
                        format: "uri",
                      },
                      uniqueItems: true,
                    },
                  ],
                },
                "@value": {
                  type: [
                    "string",
                    "null",
                  ],
                },
                "rdfs:label": {
                  type: [
                    "string",
                    "null",
                  ],
                },
              },
              required: [
                "@value",
              ],
              "schema:name": "Sex",
              "schema:description": "",
              "pav:createdOn": "2024-11-20T03:41:06-08:00",
              "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "pav:lastUpdatedOn": "2024-11-20T03:41:06-08:00",
              "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "schema:schemaVersion": "1.6.0",
              additionalProperties: false,
              "skos:prefLabel": "Sex",
              "@id": "https://repo.metadatacenter.org/template-fields/bfd1ebfa-aad0-48d2-a193-c5b7dc1f0277",
              $schema: "http://json-schema.org/draft-04/schema#",
              _path: "IJC_sample_metadata.Sex",
              _tmp: {
                nested: true,
              },
            },
            "Development stage": {
              "@type": "https://schema.metadatacenter.org/core/TemplateField",
              "@context": {
                xsd: "http://www.w3.org/2001/XMLSchema#",
                pav: "http://purl.org/pav/",
                bibo: "http://purl.org/ontology/bibo/",
                oslc: "http://open-services.net/ns/core#",
                schema: "http://schema.org/",
                skos: "http://www.w3.org/2004/02/skos/core#",
                "schema:name": {
                  "@type": "xsd:string",
                },
                "schema:description": {
                  "@type": "xsd:string",
                },
                "skos:prefLabel": {
                  "@type": "xsd:string",
                },
                "skos:altLabel": {
                  "@type": "xsd:string",
                },
                "pav:createdOn": {
                  "@type": "xsd:dateTime",
                },
                "pav:createdBy": {
                  "@type": "@id",
                },
                "pav:lastUpdatedOn": {
                  "@type": "xsd:dateTime",
                },
                "oslc:modifiedBy": {
                  "@type": "@id",
                },
              },
              type: "object",
              title: "Development stage field schema",
              description: "Development stage field schema generated by the CEDAR Template Editor 2.6.62",
              _ui: {
                inputType: "list",
              },
              _valueConstraints: {
                requiredValue: false,
                multipleChoice: false,
                literals: [
                  {
                    label: "Prenatal",
                  },
                  {
                    label: "Neonatal",
                  },
                  {
                    label: "Child/Juvenile",
                  },
                  {
                    label: "Adult",
                  },
                ],
              },
              properties: {
                "@type": {
                  oneOf: [
                    {
                      type: "string",
                      format: "uri",
                    },
                    {
                      type: "array",
                      minItems: 1,
                      items: {
                        type: "string",
                        format: "uri",
                      },
                      uniqueItems: true,
                    },
                  ],
                },
                "@value": {
                  type: [
                    "string",
                    "null",
                  ],
                },
                "rdfs:label": {
                  type: [
                    "string",
                    "null",
                  ],
                },
              },
              required: [
                "@value",
              ],
              "schema:name": "Development stage",
              "schema:description": "",
              "pav:createdOn": "2024-11-20T03:41:06-08:00",
              "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "pav:lastUpdatedOn": "2024-11-20T03:41:06-08:00",
              "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "schema:schemaVersion": "1.6.0",
              additionalProperties: false,
              "skos:prefLabel": "Development stage",
              "@id": "https://repo.metadatacenter.org/template-fields/b24fa3ad-e941-478e-a05a-0bea54d4c2eb",
              $schema: "http://json-schema.org/draft-04/schema#",
              _path: "IJC_sample_metadata.Development stage",
              _tmp: {
                nested: true,
              },
            },
            "Sample origin": {
              "@type": "https://schema.metadatacenter.org/core/TemplateField",
              "@context": {
                xsd: "http://www.w3.org/2001/XMLSchema#",
                pav: "http://purl.org/pav/",
                bibo: "http://purl.org/ontology/bibo/",
                oslc: "http://open-services.net/ns/core#",
                schema: "http://schema.org/",
                skos: "http://www.w3.org/2004/02/skos/core#",
                "schema:name": {
                  "@type": "xsd:string",
                },
                "schema:description": {
                  "@type": "xsd:string",
                },
                "skos:prefLabel": {
                  "@type": "xsd:string",
                },
                "skos:altLabel": {
                  "@type": "xsd:string",
                },
                "pav:createdOn": {
                  "@type": "xsd:dateTime",
                },
                "pav:createdBy": {
                  "@type": "@id",
                },
                "pav:lastUpdatedOn": {
                  "@type": "xsd:dateTime",
                },
                "oslc:modifiedBy": {
                  "@type": "@id",
                },
              },
              type: "object",
              title: "Sample origin field schema",
              description: "Sample origin field schema generated by the CEDAR Template Editor 2.6.62",
              _ui: {
                inputType: "textfield",
                valueRecommendationEnabled: true,
              },
              _valueConstraints: {
                requiredValue: true,
                ontologies: [
                ],
                valueSets: [
                ],
                classes: [
                ],
                branches: [
                  {
                    source: "Uber Anatomy Ontology (UBERON)",
                    acronym: "UBERON",
                    uri: "http://purl.obolibrary.org/obo/UBERON_0001062",
                    name: "anatomical entity",
                    maxDepth: 0,
                  },
                ],
                multipleChoice: false,
              },
              properties: {
                "@type": {
                  oneOf: [
                    {
                      type: "string",
                      format: "uri",
                    },
                    {
                      type: "array",
                      minItems: 1,
                      items: {
                        type: "string",
                        format: "uri",
                      },
                      uniqueItems: true,
                    },
                  ],
                },
                "rdfs:label": {
                  type: [
                    "string",
                    "null",
                  ],
                },
                "@id": {
                  type: "string",
                  format: "uri",
                },
              },
              "schema:name": "Sample origin",
              "schema:description": "",
              "pav:createdOn": "2024-11-20T03:41:06-08:00",
              "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "pav:lastUpdatedOn": "2024-11-20T03:41:06-08:00",
              "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "schema:schemaVersion": "1.6.0",
              additionalProperties: false,
              "skos:prefLabel": "Sample origin",
              "@id": "https://repo.metadatacenter.org/template-fields/a4507058-f156-4f3a-9830-b8ffda33050d",
              $schema: "http://json-schema.org/draft-04/schema#",
              _path: "IJC_sample_metadata.Sample origin",
              _tmp: {
                nested: true,
              },
            },
            Celltype: {
              "@type": "https://schema.metadatacenter.org/core/TemplateField",
              "@context": {
                xsd: "http://www.w3.org/2001/XMLSchema#",
                pav: "http://purl.org/pav/",
                bibo: "http://purl.org/ontology/bibo/",
                oslc: "http://open-services.net/ns/core#",
                schema: "http://schema.org/",
                skos: "http://www.w3.org/2004/02/skos/core#",
                "schema:name": {
                  "@type": "xsd:string",
                },
                "schema:description": {
                  "@type": "xsd:string",
                },
                "skos:prefLabel": {
                  "@type": "xsd:string",
                },
                "skos:altLabel": {
                  "@type": "xsd:string",
                },
                "pav:createdOn": {
                  "@type": "xsd:dateTime",
                },
                "pav:createdBy": {
                  "@type": "@id",
                },
                "pav:lastUpdatedOn": {
                  "@type": "xsd:dateTime",
                },
                "oslc:modifiedBy": {
                  "@type": "@id",
                },
              },
              type: "object",
              title: "Celltype field schema",
              description: "Celltype field schema generated by the CEDAR Template Editor 2.6.62",
              _ui: {
                inputType: "textfield",
                valueRecommendationEnabled: true,
              },
              _valueConstraints: {
                requiredValue: true,
                ontologies: [
                ],
                valueSets: [
                ],
                classes: [
                ],
                branches: [
                  {
                    source: "BRENDA Tissue and Enzyme Source Ontology (BTO)",
                    acronym: "BTO",
                    uri: "http://purl.obolibrary.org/obo/BTO_0001489",
                    name: "whole body",
                    maxDepth: 0,
                  },
                ],
                multipleChoice: false,
              },
              properties: {
                "@type": {
                  oneOf: [
                    {
                      type: "string",
                      format: "uri",
                    },
                    {
                      type: "array",
                      minItems: 1,
                      items: {
                        type: "string",
                        format: "uri",
                      },
                      uniqueItems: true,
                    },
                  ],
                },
                "rdfs:label": {
                  type: [
                    "string",
                    "null",
                  ],
                },
                "@id": {
                  type: "string",
                  format: "uri",
                },
              },
              "schema:name": "Celltype",
              "schema:description": "",
              "pav:createdOn": "2024-11-20T03:41:06-08:00",
              "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "pav:lastUpdatedOn": "2024-11-20T03:41:06-08:00",
              "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "schema:schemaVersion": "1.6.0",
              additionalProperties: false,
              "skos:prefLabel": "Celltype",
              "@id": "https://repo.metadatacenter.org/template-fields/5e4b63d8-57b8-4d04-b0d3-6125e0097dcc",
              $schema: "http://json-schema.org/draft-04/schema#",
              _path: "IJC_sample_metadata.Celltype",
              _tmp: {
                nested: true,
              },
            },
            "Treatment specify": {
              "@type": "https://schema.metadatacenter.org/core/TemplateField",
              "@context": {
                xsd: "http://www.w3.org/2001/XMLSchema#",
                pav: "http://purl.org/pav/",
                bibo: "http://purl.org/ontology/bibo/",
                oslc: "http://open-services.net/ns/core#",
                schema: "http://schema.org/",
                skos: "http://www.w3.org/2004/02/skos/core#",
                "schema:name": {
                  "@type": "xsd:string",
                },
                "schema:description": {
                  "@type": "xsd:string",
                },
                "skos:prefLabel": {
                  "@type": "xsd:string",
                },
                "skos:altLabel": {
                  "@type": "xsd:string",
                },
                "pav:createdOn": {
                  "@type": "xsd:dateTime",
                },
                "pav:createdBy": {
                  "@type": "@id",
                },
                "pav:lastUpdatedOn": {
                  "@type": "xsd:dateTime",
                },
                "oslc:modifiedBy": {
                  "@type": "@id",
                },
              },
              type: "object",
              title: "Treatment specify field schema",
              description: "Treatment specify field schema generated by the CEDAR Template Editor 2.6.62",
              _ui: {
                inputType: "textarea",
              },
              _valueConstraints: {
                requiredValue: false,
              },
              properties: {
                "@type": {
                  oneOf: [
                    {
                      type: "string",
                      format: "uri",
                    },
                    {
                      type: "array",
                      minItems: 1,
                      items: {
                        type: "string",
                        format: "uri",
                      },
                      uniqueItems: true,
                    },
                  ],
                },
                "@value": {
                  type: [
                    "string",
                    "null",
                  ],
                },
                "rdfs:label": {
                  type: [
                    "string",
                    "null",
                  ],
                },
              },
              required: [
                "@value",
              ],
              "schema:name": "Treatment specify",
              "schema:description": "",
              "pav:createdOn": "2024-11-20T03:41:06-08:00",
              "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "pav:lastUpdatedOn": "2024-11-20T03:41:06-08:00",
              "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "schema:schemaVersion": "1.6.0",
              additionalProperties: false,
              "@id": "https://repo.metadatacenter.org/template-fields/56a054f5-ee6d-4f5e-afe2-675c23e53560",
              "skos:prefLabel": "Treatment specify",
              $schema: "http://json-schema.org/draft-04/schema#",
              _path: "IJC_sample_metadata.Treatment specify",
              _tmp: {
                nested: true,
              },
            },
            "Cell Line Name": {
              "@type": "https://schema.metadatacenter.org/core/TemplateField",
              "@context": {
                xsd: "http://www.w3.org/2001/XMLSchema#",
                pav: "http://purl.org/pav/",
                bibo: "http://purl.org/ontology/bibo/",
                oslc: "http://open-services.net/ns/core#",
                schema: "http://schema.org/",
                skos: "http://www.w3.org/2004/02/skos/core#",
                "schema:name": {
                  "@type": "xsd:string",
                },
                "schema:description": {
                  "@type": "xsd:string",
                },
                "skos:prefLabel": {
                  "@type": "xsd:string",
                },
                "skos:altLabel": {
                  "@type": "xsd:string",
                },
                "pav:createdOn": {
                  "@type": "xsd:dateTime",
                },
                "pav:createdBy": {
                  "@type": "@id",
                },
                "pav:lastUpdatedOn": {
                  "@type": "xsd:dateTime",
                },
                "oslc:modifiedBy": {
                  "@type": "@id",
                },
              },
              type: "object",
              title: "Cell Line Name field schema",
              description: "Cell Line Name field schema generated by the CEDAR Template Editor 2.6.62",
              _ui: {
                inputType: "textfield",
              },
              _valueConstraints: {
                requiredValue: false,
              },
              properties: {
                "@type": {
                  oneOf: [
                    {
                      type: "string",
                      format: "uri",
                    },
                    {
                      type: "array",
                      minItems: 1,
                      items: {
                        type: "string",
                        format: "uri",
                      },
                      uniqueItems: true,
                    },
                  ],
                },
                "@value": {
                  type: [
                    "string",
                    "null",
                  ],
                },
                "rdfs:label": {
                  type: [
                    "string",
                    "null",
                  ],
                },
              },
              required: [
                "@value",
              ],
              "schema:name": "Cell Line Name",
              "schema:description": "",
              "pav:createdOn": "2024-11-20T03:41:06-08:00",
              "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "pav:lastUpdatedOn": "2024-11-20T03:41:06-08:00",
              "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "schema:schemaVersion": "1.6.0",
              additionalProperties: false,
              "skos:prefLabel": "Cell Line Name",
              "@id": "https://repo.metadatacenter.org/template-fields/08f25588-9817-4c1e-9707-2991f1c3ac9a",
              $schema: "http://json-schema.org/draft-04/schema#",
              _path: "IJC_sample_metadata.Cell Line Name",
              _tmp: {
                nested: true,
              },
            },
            "Tumor subtype": {
              "@type": "https://schema.metadatacenter.org/core/TemplateField",
              "@context": {
                xsd: "http://www.w3.org/2001/XMLSchema#",
                pav: "http://purl.org/pav/",
                bibo: "http://purl.org/ontology/bibo/",
                oslc: "http://open-services.net/ns/core#",
                schema: "http://schema.org/",
                skos: "http://www.w3.org/2004/02/skos/core#",
                "schema:name": {
                  "@type": "xsd:string",
                },
                "schema:description": {
                  "@type": "xsd:string",
                },
                "skos:prefLabel": {
                  "@type": "xsd:string",
                },
                "skos:altLabel": {
                  "@type": "xsd:string",
                },
                "pav:createdOn": {
                  "@type": "xsd:dateTime",
                },
                "pav:createdBy": {
                  "@type": "@id",
                },
                "pav:lastUpdatedOn": {
                  "@type": "xsd:dateTime",
                },
                "oslc:modifiedBy": {
                  "@type": "@id",
                },
              },
              type: "object",
              title: "Tumor subtype field schema",
              description: "Tumor subtype field schema generated by the CEDAR Template Editor 2.6.62",
              _ui: {
                inputType: "textfield",
              },
              _valueConstraints: {
                requiredValue: false,
                ontologies: [
                ],
                valueSets: [
                ],
                classes: [
                ],
                branches: [
                  {
                    source: "SNOMED CT (SNOMEDCT)",
                    acronym: "SNOMEDCT",
                    uri: "http://purl.bioontology.org/ontology/SNOMEDCT/416939005",
                    name: "Proliferative mass",
                    maxDepth: 0,
                  },
                ],
                multipleChoice: false,
              },
              properties: {
                "@type": {
                  oneOf: [
                    {
                      type: "string",
                      format: "uri",
                    },
                    {
                      type: "array",
                      minItems: 1,
                      items: {
                        type: "string",
                        format: "uri",
                      },
                      uniqueItems: true,
                    },
                  ],
                },
                "rdfs:label": {
                  type: [
                    "string",
                    "null",
                  ],
                },
                "@id": {
                  type: "string",
                  format: "uri",
                },
              },
              "schema:name": "Tumor subtype",
              "schema:description": "Morphological type",
              "pav:createdOn": "2024-11-20T03:41:06-08:00",
              "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "pav:lastUpdatedOn": "2024-11-20T03:41:06-08:00",
              "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "schema:schemaVersion": "1.6.0",
              additionalProperties: false,
              "skos:prefLabel": "Tumor subtype",
              "@id": "https://repo.metadatacenter.org/template-fields/166df551-5845-450a-876e-c8ffdd82a3d3",
              $schema: "http://json-schema.org/draft-04/schema#",
              _path: "IJC_sample_metadata.Tumor subtype",
              _tmp: {
                nested: true,
              },
            },
            Treatement: {
              "@type": "https://schema.metadatacenter.org/core/TemplateField",
              "@context": {
                xsd: "http://www.w3.org/2001/XMLSchema#",
                pav: "http://purl.org/pav/",
                bibo: "http://purl.org/ontology/bibo/",
                oslc: "http://open-services.net/ns/core#",
                schema: "http://schema.org/",
                skos: "http://www.w3.org/2004/02/skos/core#",
                "schema:name": {
                  "@type": "xsd:string",
                },
                "schema:description": {
                  "@type": "xsd:string",
                },
                "skos:prefLabel": {
                  "@type": "xsd:string",
                },
                "skos:altLabel": {
                  "@type": "xsd:string",
                },
                "pav:createdOn": {
                  "@type": "xsd:dateTime",
                },
                "pav:createdBy": {
                  "@type": "@id",
                },
                "pav:lastUpdatedOn": {
                  "@type": "xsd:dateTime",
                },
                "oslc:modifiedBy": {
                  "@type": "@id",
                },
              },
              type: "object",
              title: "Treatement field schema",
              description: "Treatement field schema generated by the CEDAR Template Editor 2.6.62",
              _ui: {
                inputType: "radio",
              },
              _valueConstraints: {
                requiredValue: true,
                multipleChoice: false,
                literals: [
                  {
                    label: "Yes",
                    $$hashKey: "object:526",
                  },
                  {
                    label: "No",
                    $$hashKey: "object:527",
                  },
                ],
              },
              properties: {
                "@type": {
                  oneOf: [
                    {
                      type: "string",
                      format: "uri",
                    },
                    {
                      type: "array",
                      minItems: 1,
                      items: {
                        type: "string",
                        format: "uri",
                      },
                      uniqueItems: true,
                    },
                  ],
                },
                "@value": {
                  type: [
                    "string",
                    "null",
                  ],
                },
                "rdfs:label": {
                  type: [
                    "string",
                    "null",
                  ],
                },
              },
              required: [
                "@value",
              ],
              "schema:name": "Treatement",
              "schema:description": "",
              "pav:createdOn": "2024-11-20T03:41:06-08:00",
              "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "pav:lastUpdatedOn": "2024-11-20T03:41:06-08:00",
              "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "schema:schemaVersion": "1.6.0",
              additionalProperties: false,
              "skos:prefLabel": "Treatement",
              "@id": "https://repo.metadatacenter.org/template-fields/8708ec1b-767b-45d8-90e0-55dfda8c1025",
              $schema: "http://json-schema.org/draft-04/schema#",
              _path: "IJC_sample_metadata.Treatement",
              _tmp: {
                nested: true,
              },
            },
            "Patient clinical data available": {
              "@type": "https://schema.metadatacenter.org/core/TemplateField",
              "@context": {
                xsd: "http://www.w3.org/2001/XMLSchema#",
                pav: "http://purl.org/pav/",
                bibo: "http://purl.org/ontology/bibo/",
                oslc: "http://open-services.net/ns/core#",
                schema: "http://schema.org/",
                skos: "http://www.w3.org/2004/02/skos/core#",
                "schema:name": {
                  "@type": "xsd:string",
                },
                "schema:description": {
                  "@type": "xsd:string",
                },
                "skos:prefLabel": {
                  "@type": "xsd:string",
                },
                "skos:altLabel": {
                  "@type": "xsd:string",
                },
                "pav:createdOn": {
                  "@type": "xsd:dateTime",
                },
                "pav:createdBy": {
                  "@type": "@id",
                },
                "pav:lastUpdatedOn": {
                  "@type": "xsd:dateTime",
                },
                "oslc:modifiedBy": {
                  "@type": "@id",
                },
              },
              type: "object",
              title: "Patient clinical data available field schema",
              description: "Patient clinical data available field schema generated by the CEDAR Template Editor 2.6.62",
              _ui: {
                inputType: "radio",
              },
              _valueConstraints: {
                requiredValue: false,
                multipleChoice: false,
                literals: [
                  {
                    label: "Yes",
                    $$hashKey: "object:531",
                  },
                  {
                    label: "No",
                    $$hashKey: "object:532",
                  },
                ],
              },
              properties: {
                "@type": {
                  oneOf: [
                    {
                      type: "string",
                      format: "uri",
                    },
                    {
                      type: "array",
                      minItems: 1,
                      items: {
                        type: "string",
                        format: "uri",
                      },
                      uniqueItems: true,
                    },
                  ],
                },
                "@value": {
                  type: [
                    "string",
                    "null",
                  ],
                },
                "rdfs:label": {
                  type: [
                    "string",
                    "null",
                  ],
                },
              },
              required: [
                "@value",
              ],
              "schema:name": "Patient clinical data available",
              "schema:description": "",
              "pav:createdOn": "2024-11-20T03:41:06-08:00",
              "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "pav:lastUpdatedOn": "2024-11-20T03:41:06-08:00",
              "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "schema:schemaVersion": "1.6.0",
              additionalProperties: false,
              "skos:prefLabel": "Patient clinical data available",
              "@id": "https://repo.metadatacenter.org/template-fields/a181b916-34c7-4768-85cc-727e92def992",
              $schema: "http://json-schema.org/draft-04/schema#",
              _path: "IJC_sample_metadata.Patient clinical data available",
              _tmp: {
                nested: true,
              },
            },
            "Patient survival data available": {
              "@type": "https://schema.metadatacenter.org/core/TemplateField",
              "@context": {
                xsd: "http://www.w3.org/2001/XMLSchema#",
                pav: "http://purl.org/pav/",
                bibo: "http://purl.org/ontology/bibo/",
                oslc: "http://open-services.net/ns/core#",
                schema: "http://schema.org/",
                skos: "http://www.w3.org/2004/02/skos/core#",
                "schema:name": {
                  "@type": "xsd:string",
                },
                "schema:description": {
                  "@type": "xsd:string",
                },
                "skos:prefLabel": {
                  "@type": "xsd:string",
                },
                "skos:altLabel": {
                  "@type": "xsd:string",
                },
                "pav:createdOn": {
                  "@type": "xsd:dateTime",
                },
                "pav:createdBy": {
                  "@type": "@id",
                },
                "pav:lastUpdatedOn": {
                  "@type": "xsd:dateTime",
                },
                "oslc:modifiedBy": {
                  "@type": "@id",
                },
              },
              type: "object",
              title: "Patient survival data available field schema",
              description: "Patient survival data available field schema generated by the CEDAR Template Editor 2.6.62",
              _ui: {
                inputType: "radio",
              },
              _valueConstraints: {
                requiredValue: false,
                multipleChoice: false,
                literals: [
                  {
                    label: "Yes",
                    $$hashKey: "object:536",
                  },
                  {
                    label: "No",
                    $$hashKey: "object:537",
                  },
                ],
              },
              properties: {
                "@type": {
                  oneOf: [
                    {
                      type: "string",
                      format: "uri",
                    },
                    {
                      type: "array",
                      minItems: 1,
                      items: {
                        type: "string",
                        format: "uri",
                      },
                      uniqueItems: true,
                    },
                  ],
                },
                "@value": {
                  type: [
                    "string",
                    "null",
                  ],
                },
                "rdfs:label": {
                  type: [
                    "string",
                    "null",
                  ],
                },
              },
              required: [
                "@value",
              ],
              "schema:name": "Patient survival data available",
              "schema:description": "",
              "pav:createdOn": "2024-11-20T03:41:06-08:00",
              "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "pav:lastUpdatedOn": "2024-11-20T03:41:06-08:00",
              "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "schema:schemaVersion": "1.6.0",
              additionalProperties: false,
              "skos:prefLabel": "Patient survival data available",
              "@id": "https://repo.metadatacenter.org/template-fields/79d7de82-ebcc-40b8-90f0-e738b754a211",
              $schema: "http://json-schema.org/draft-04/schema#",
              _path: "IJC_sample_metadata.Patient survival data available",
              _tmp: {
                nested: true,
              },
            },
            "Sample name": {
              "@type": "https://schema.metadatacenter.org/core/TemplateField",
              "@context": {
                xsd: "http://www.w3.org/2001/XMLSchema#",
                pav: "http://purl.org/pav/",
                bibo: "http://purl.org/ontology/bibo/",
                oslc: "http://open-services.net/ns/core#",
                schema: "http://schema.org/",
                skos: "http://www.w3.org/2004/02/skos/core#",
                "schema:name": {
                  "@type": "xsd:string",
                },
                "schema:description": {
                  "@type": "xsd:string",
                },
                "skos:prefLabel": {
                  "@type": "xsd:string",
                },
                "skos:altLabel": {
                  "@type": "xsd:string",
                },
                "pav:createdOn": {
                  "@type": "xsd:dateTime",
                },
                "pav:createdBy": {
                  "@type": "@id",
                },
                "pav:lastUpdatedOn": {
                  "@type": "xsd:dateTime",
                },
                "oslc:modifiedBy": {
                  "@type": "@id",
                },
              },
              type: "object",
              title: "Sample name field schema",
              description: "Sample name field schema generated by the CEDAR Template Editor 2.7.1",
              _ui: {
                inputType: "textfield",
              },
              _valueConstraints: {
                requiredValue: true,
              },
              properties: {
                "@type": {
                  oneOf: [
                    {
                      type: "string",
                      format: "uri",
                    },
                    {
                      type: "array",
                      minItems: 1,
                      items: {
                        type: "string",
                        format: "uri",
                      },
                      uniqueItems: true,
                    },
                  ],
                },
                "@value": {
                  type: [
                    "string",
                    "null",
                  ],
                },
                "rdfs:label": {
                  type: [
                    "string",
                    "null",
                  ],
                },
              },
              required: [
                "@value",
              ],
              "schema:name": "Sample name",
              "schema:description": "",
              "pav:createdOn": "2024-11-20T03:41:06-08:00",
              "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "pav:lastUpdatedOn": "2024-11-20T03:41:06-08:00",
              "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "schema:schemaVersion": "1.6.0",
              additionalProperties: false,
              "skos:prefLabel": "Sample name",
              "@id": "https://repo.metadatacenter.org/template-fields/e5ac39dd-c264-465e-82ec-de1f73469c51",
              $schema: "http://json-schema.org/draft-04/schema#",
              _path: "IJC_sample_metadata.Sample name",
              _tmp: {
                nested: true,
              },
            },
            "Sample preservation": {
              type: "object",
              "@id": "https://repo.metadatacenter.org/template-fields/58e86939-3d40-4aa3-9bf5-dd4c1a39731b",
              "@type": "https://schema.metadatacenter.org/core/TemplateField",
              "@context": {
                xsd: "http://www.w3.org/2001/XMLSchema#",
                pav: "http://purl.org/pav/",
                bibo: "http://purl.org/ontology/bibo/",
                oslc: "http://open-services.net/ns/core#",
                schema: "http://schema.org/",
                skos: "http://www.w3.org/2004/02/skos/core#",
                "schema:name": {
                  "@type": "xsd:string",
                },
                "schema:description": {
                  "@type": "xsd:string",
                },
                "skos:prefLabel": {
                  "@type": "xsd:string",
                },
                "skos:altLabel": {
                  "@type": "xsd:string",
                },
                "pav:createdOn": {
                  "@type": "xsd:dateTime",
                },
                "pav:createdBy": {
                  "@type": "@id",
                },
                "pav:lastUpdatedOn": {
                  "@type": "xsd:dateTime",
                },
                "oslc:modifiedBy": {
                  "@type": "@id",
                },
              },
              title: "Sample preservation field schema",
              description: "Sample preservation field schema generated by the CEDAR Template Editor 2.7.1",
              _ui: {
                inputType: "list",
              },
              _valueConstraints: {
                requiredValue: false,
                multipleChoice: false,
                literals: [
                  {
                    label: "Formol",
                  },
                  {
                    label: "FFPE",
                  },
                  {
                    label: "FF_DNA",
                  },
                  {
                    label: "Frozen",
                  },
                  {
                    label: "Other",
                  },
                  {
                    label: "Unknown",
                  },
                ],
              },
              properties: {
                "@type": {
                  oneOf: [
                    {
                      type: "string",
                      format: "uri",
                    },
                    {
                      type: "array",
                      minItems: 1,
                      items: {
                        type: "string",
                        format: "uri",
                      },
                      uniqueItems: true,
                    },
                  ],
                },
                "@value": {
                  type: [
                    "string",
                    "null",
                  ],
                },
                "rdfs:label": {
                  type: [
                    "string",
                    "null",
                  ],
                },
              },
              required: [
                "@value",
              ],
              additionalProperties: false,
              "pav:createdOn": "2024-11-20T03:41:06-08:00",
              "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "pav:lastUpdatedOn": "2024-11-20T03:41:06-08:00",
              "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "schema:schemaVersion": "1.6.0",
              "schema:name": "Sample preservation",
              "schema:description": "",
              $schema: "http://json-schema.org/draft-04/schema#",
              _path: "IJC_sample_metadata.Sample preservation",
              _tmp: {
                nested: true,
              },
            },
            "DNA concentration measure technology": {
              "@type": "https://schema.metadatacenter.org/core/TemplateField",
              "@context": {
                xsd: "http://www.w3.org/2001/XMLSchema#",
                pav: "http://purl.org/pav/",
                bibo: "http://purl.org/ontology/bibo/",
                oslc: "http://open-services.net/ns/core#",
                schema: "http://schema.org/",
                skos: "http://www.w3.org/2004/02/skos/core#",
                "schema:name": {
                  "@type": "xsd:string",
                },
                "schema:description": {
                  "@type": "xsd:string",
                },
                "skos:prefLabel": {
                  "@type": "xsd:string",
                },
                "skos:altLabel": {
                  "@type": "xsd:string",
                },
                "pav:createdOn": {
                  "@type": "xsd:dateTime",
                },
                "pav:createdBy": {
                  "@type": "@id",
                },
                "pav:lastUpdatedOn": {
                  "@type": "xsd:dateTime",
                },
                "oslc:modifiedBy": {
                  "@type": "@id",
                },
              },
              type: "object",
              title: "DNA concentration measure technology field schema",
              description: "DNA concentration measure technology field schema generated by the CEDAR Template Editor 2.7.1",
              _ui: {
                inputType: "list",
              },
              _valueConstraints: {
                requiredValue: false,
                multipleChoice: false,
                literals: [
                  {
                    label: "Pyrosequencing",
                  },
                  {
                    label: "Other",
                  },
                  {
                    label: "Does not apply",
                  },
                ],
              },
              properties: {
                "@type": {
                  oneOf: [
                    {
                      type: "string",
                      format: "uri",
                    },
                    {
                      type: "array",
                      minItems: 1,
                      items: {
                        type: "string",
                        format: "uri",
                      },
                      uniqueItems: true,
                    },
                  ],
                },
                "@value": {
                  type: [
                    "string",
                    "null",
                  ],
                },
                "rdfs:label": {
                  type: [
                    "string",
                    "null",
                  ],
                },
              },
              required: [
                "@value",
              ],
              "schema:name": "DNA concentration measure technology",
              "schema:description": "",
              "pav:createdOn": "2024-11-20T03:41:06-08:00",
              "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "pav:lastUpdatedOn": "2024-11-20T03:41:06-08:00",
              "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "schema:schemaVersion": "1.6.0",
              additionalProperties: false,
              "@id": "https://repo.metadatacenter.org/template-fields/05dcac16-580d-4a76-abf7-80ffb9c8b528",
              $schema: "http://json-schema.org/draft-04/schema#",
              _path: "IJC_sample_metadata.DNA concentration measure technology",
              _tmp: {
                nested: true,
              },
            },
            Notes: {
              "@type": "https://schema.metadatacenter.org/core/TemplateField",
              "@context": {
                xsd: "http://www.w3.org/2001/XMLSchema#",
                pav: "http://purl.org/pav/",
                bibo: "http://purl.org/ontology/bibo/",
                oslc: "http://open-services.net/ns/core#",
                schema: "http://schema.org/",
                skos: "http://www.w3.org/2004/02/skos/core#",
                "schema:name": {
                  "@type": "xsd:string",
                },
                "schema:description": {
                  "@type": "xsd:string",
                },
                "skos:prefLabel": {
                  "@type": "xsd:string",
                },
                "skos:altLabel": {
                  "@type": "xsd:string",
                },
                "pav:createdOn": {
                  "@type": "xsd:dateTime",
                },
                "pav:createdBy": {
                  "@type": "@id",
                },
                "pav:lastUpdatedOn": {
                  "@type": "xsd:dateTime",
                },
                "oslc:modifiedBy": {
                  "@type": "@id",
                },
              },
              type: "object",
              title: "Notes field schema",
              description: "Notes field schema generated by the CEDAR Template Editor 2.7.1",
              _ui: {
                inputType: "textarea",
              },
              _valueConstraints: {
                requiredValue: false,
              },
              properties: {
                "@type": {
                  oneOf: [
                    {
                      type: "string",
                      format: "uri",
                    },
                    {
                      type: "array",
                      minItems: 1,
                      items: {
                        type: "string",
                        format: "uri",
                      },
                      uniqueItems: true,
                    },
                  ],
                },
                "@value": {
                  type: [
                    "string",
                    "null",
                  ],
                },
                "rdfs:label": {
                  type: [
                    "string",
                    "null",
                  ],
                },
              },
              required: [
                "@value",
              ],
              "schema:name": "Notes",
              "schema:description": "",
              "pav:createdOn": "2024-11-20T03:41:06-08:00",
              "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "pav:lastUpdatedOn": "2024-11-20T03:41:06-08:00",
              "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "schema:schemaVersion": "1.6.0",
              additionalProperties: false,
              "@id": "https://repo.metadatacenter.org/template-fields/a84d6ecc-0d7f-4eb1-b767-442542d7b1a8",
              $schema: "http://json-schema.org/draft-04/schema#",
              _path: "IJC_sample_metadata.Notes",
              _tmp: {
                nested: true,
              },
            },
            Species: {
              "@type": "https://schema.metadatacenter.org/core/TemplateField",
              "@context": {
                xsd: "http://www.w3.org/2001/XMLSchema#",
                pav: "http://purl.org/pav/",
                bibo: "http://purl.org/ontology/bibo/",
                oslc: "http://open-services.net/ns/core#",
                schema: "http://schema.org/",
                skos: "http://www.w3.org/2004/02/skos/core#",
                "schema:name": {
                  "@type": "xsd:string",
                },
                "schema:description": {
                  "@type": "xsd:string",
                },
                "skos:prefLabel": {
                  "@type": "xsd:string",
                },
                "skos:altLabel": {
                  "@type": "xsd:string",
                },
                "pav:createdOn": {
                  "@type": "xsd:dateTime",
                },
                "pav:createdBy": {
                  "@type": "@id",
                },
                "pav:lastUpdatedOn": {
                  "@type": "xsd:dateTime",
                },
                "oslc:modifiedBy": {
                  "@type": "@id",
                },
              },
              type: "object",
              title: "Species field schema",
              description: "Species field schema generated by the CEDAR Template Editor 2.7.1",
              _ui: {
                inputType: "list",
              },
              _valueConstraints: {
                requiredValue: true,
                multipleChoice: false,
                literals: [
                  {
                    label: "Homo sapiens",
                  },
                  {
                    label: "Rattus norvegicus",
                  },
                  {
                    label: "Mus musculus",
                  },
                  {
                    label: "Gallus gallus",
                  },
                  {
                    label: "Other. Specify in the \"Other species\" field",
                  },
                ],
              },
              properties: {
                "@type": {
                  oneOf: [
                    {
                      type: "string",
                      format: "uri",
                    },
                    {
                      type: "array",
                      minItems: 1,
                      items: {
                        type: "string",
                        format: "uri",
                      },
                      uniqueItems: true,
                    },
                  ],
                },
                "@value": {
                  type: [
                    "string",
                    "null",
                  ],
                },
                "rdfs:label": {
                  type: [
                    "string",
                    "null",
                  ],
                },
              },
              required: [
                "@value",
              ],
              "schema:name": "Species",
              "schema:description": "",
              "pav:createdOn": "2024-11-20T03:41:06-08:00",
              "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "pav:lastUpdatedOn": "2024-11-20T03:41:06-08:00",
              "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "schema:schemaVersion": "1.6.0",
              additionalProperties: false,
              "@id": "https://repo.metadatacenter.org/template-fields/93c87858-15a7-47d2-99ba-25dca29d3e84",
              $schema: "http://json-schema.org/draft-04/schema#",
              _path: "IJC_sample_metadata.Species",
              _tmp: {
                nested: true,
              },
            },
            "Age value": {
              "@type": "https://schema.metadatacenter.org/core/TemplateField",
              "@context": {
                xsd: "http://www.w3.org/2001/XMLSchema#",
                pav: "http://purl.org/pav/",
                bibo: "http://purl.org/ontology/bibo/",
                oslc: "http://open-services.net/ns/core#",
                schema: "http://schema.org/",
                skos: "http://www.w3.org/2004/02/skos/core#",
                "schema:name": {
                  "@type": "xsd:string",
                },
                "schema:description": {
                  "@type": "xsd:string",
                },
                "skos:prefLabel": {
                  "@type": "xsd:string",
                },
                "skos:altLabel": {
                  "@type": "xsd:string",
                },
                "pav:createdOn": {
                  "@type": "xsd:dateTime",
                },
                "pav:createdBy": {
                  "@type": "@id",
                },
                "pav:lastUpdatedOn": {
                  "@type": "xsd:dateTime",
                },
                "oslc:modifiedBy": {
                  "@type": "@id",
                },
              },
              type: "object",
              title: "Age value field schema",
              description: "Age value field schema generated by the CEDAR Template Editor 2.7.1",
              _ui: {
                inputType: "numeric",
              },
              _valueConstraints: {
                requiredValue: false,
                numberType: "xsd:decimal",
              },
              properties: {
                "@value": {
                  type: [
                    "string",
                    "null",
                  ],
                },
                "rdfs:label": {
                  type: [
                    "string",
                    "null",
                  ],
                },
                "@type": {
                  type: "string",
                  format: "uri",
                },
              },
              required: [
                "@value",
                "@type",
              ],
              "schema:name": "Age value",
              "schema:description": "",
              "pav:createdOn": "2024-11-20T03:41:06-08:00",
              "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "pav:lastUpdatedOn": "2024-11-20T03:41:06-08:00",
              "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "schema:schemaVersion": "1.6.0",
              additionalProperties: false,
              "@id": "https://repo.metadatacenter.org/template-fields/d3642d1d-abec-46c8-9d26-6e731b3f29d1",
              $schema: "http://json-schema.org/draft-04/schema#",
              _path: "IJC_sample_metadata.Age value",
              _tmp: {
                nested: true,
              },
            },
            "Age unit": {
              "@type": "https://schema.metadatacenter.org/core/TemplateField",
              "@context": {
                xsd: "http://www.w3.org/2001/XMLSchema#",
                pav: "http://purl.org/pav/",
                bibo: "http://purl.org/ontology/bibo/",
                oslc: "http://open-services.net/ns/core#",
                schema: "http://schema.org/",
                skos: "http://www.w3.org/2004/02/skos/core#",
                "schema:name": {
                  "@type": "xsd:string",
                },
                "schema:description": {
                  "@type": "xsd:string",
                },
                "skos:prefLabel": {
                  "@type": "xsd:string",
                },
                "skos:altLabel": {
                  "@type": "xsd:string",
                },
                "pav:createdOn": {
                  "@type": "xsd:dateTime",
                },
                "pav:createdBy": {
                  "@type": "@id",
                },
                "pav:lastUpdatedOn": {
                  "@type": "xsd:dateTime",
                },
                "oslc:modifiedBy": {
                  "@type": "@id",
                },
              },
              type: "object",
              title: "Age unit field schema",
              description: "Age unit field schema generated by the CEDAR Template Editor 2.7.1",
              _ui: {
                inputType: "radio",
              },
              _valueConstraints: {
                requiredValue: false,
                multipleChoice: false,
                literals: [
                  {
                    label: "Years",
                    $$hashKey: "object:511",
                  },
                  {
                    label: "Days",
                    $$hashKey: "object:512",
                  },
                ],
              },
              properties: {
                "@type": {
                  oneOf: [
                    {
                      type: "string",
                      format: "uri",
                    },
                    {
                      type: "array",
                      minItems: 1,
                      items: {
                        type: "string",
                        format: "uri",
                      },
                      uniqueItems: true,
                    },
                  ],
                },
                "@value": {
                  type: [
                    "string",
                    "null",
                  ],
                },
                "rdfs:label": {
                  type: [
                    "string",
                    "null",
                  ],
                },
              },
              required: [
                "@value",
              ],
              "schema:name": "Age unit",
              "schema:description": "",
              "pav:createdOn": "2024-11-20T03:41:06-08:00",
              "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "pav:lastUpdatedOn": "2024-11-20T03:41:06-08:00",
              "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "schema:schemaVersion": "1.6.0",
              additionalProperties: false,
              "@id": "https://repo.metadatacenter.org/template-fields/1f81652a-7c6b-488d-a78d-eb33ee266bf5",
              $schema: "http://json-schema.org/draft-04/schema#",
              _path: "IJC_sample_metadata.Age unit",
              _tmp: {
                nested: true,
              },
            },
          },
          "schema:name": "Samples",
          "schema:description": "",
          required: [
            "@context",
            "@id",
            "Sample name",
            "Sample Provider",
            "Sex",
            "Sample origin",
            "Celltype",
            "Tumor",
            "Control",
            "Disease",
            "Treatment specify",
            "Primary culture",
            "Cell Line Name",
            "Other species",
            "Development stage",
            "Tumor subtype",
            "Treatement",
            "Patient clinical data available",
            "Patient survival data available",
            "Sample preservation",
            "DNA concentration measure technology",
            "Notes",
            "Species",
            "Age value",
            "Age unit",
          ],
          "pav:createdOn": "2024-11-20T03:41:09-08:00",
          "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
          "pav:lastUpdatedOn": "2024-11-20T03:41:09-08:00",
          "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
          "schema:schemaVersion": "1.6.0",
          additionalProperties: false,
          "pav:version": "0.0.1",
          "bibo:status": "bibo:draft",
          "pav:derivedFrom": "https://repo.metadatacenter.org/template-elements/8001ce62-ffa1-4bba-84cb-5aabb20368fc",
          "@id": "https://repo.metadatacenter.org/template-elements/a6153c1b-4051-4f8b-91fc-0032d973df0f",
          "schema:identifier": "IJC_sample_metadata",
          $schema: "http://json-schema.org/draft-04/schema#",
        },
      },
      IJC_PI_contact_info: {
        "@id": "https://repo.metadatacenter.org/template-elements/5a3f4eab-9390-467c-9bf1-9bb1dabe81be",
        "@type": "https://schema.metadatacenter.org/core/TemplateElement",
        "@context": {
          xsd: "http://www.w3.org/2001/XMLSchema#",
          pav: "http://purl.org/pav/",
          bibo: "http://purl.org/ontology/bibo/",
          oslc: "http://open-services.net/ns/core#",
          schema: "http://schema.org/",
          "schema:name": {
            "@type": "xsd:string",
          },
          "schema:description": {
            "@type": "xsd:string",
          },
          "pav:createdOn": {
            "@type": "xsd:dateTime",
          },
          "pav:createdBy": {
            "@type": "@id",
          },
          "pav:lastUpdatedOn": {
            "@type": "xsd:dateTime",
          },
          "oslc:modifiedBy": {
            "@type": "@id",
          },
        },
        type: "object",
        title: "Ijc_contact_info element schema",
        description: "Ijc_contact_info element schema generated by the CEDAR Template Editor 2.6.62",
        _ui: {
          order: [
            "Name",
            "Email",
            "Principal_Investigator ORCID Text (10624734)",
            "IJC_institution-company",
          ],
          propertyLabels: {
            Name: "Name",
            Email: "Email",
            "Principal_Investigator ORCID Text (10624734)": "Principal_Investigator ORCID Text (10624734)",
            "IJC_institution-company": "IJC_institution-company",
          },
          propertyDescriptions: {
            Name: "",
            "Email address Contact": "",
            Email: "",
            ORCID: "",
            ORCID1: "",
            "Principal_Investigator ORCID Text (10624734)": "A persistent unique digital identifier assigned to a principal investigator by the Open Researcher and Contributor ID (ORCID) organization.",
            "IJC_institution-company": "",
          },
        },
        properties: {
          "@context": {
            type: "object",
            properties: {
              Name: {
                enum: [
                  "https://schema.metadatacenter.org/properties/882d1bc2-e9ad-4d26-86d2-47dbd5c32fcf",
                ],
              },
              Email: {
                enum: [
                  "https://schema.metadatacenter.org/properties/623bee44-e4f2-459a-85db-abd32a638e9f",
                ],
              },
              "Principal_Investigator ORCID Text (10624734)": {
                enum: [
                  "https://schema.metadatacenter.org/properties/7469493b-5033-4c1d-a53a-cff9fe78a5a2",
                ],
              },
              "IJC_institution-company": {
                enum: [
                  "https://schema.metadatacenter.org/properties/45c8aeac-6b90-4862-a27e-aeaf21df935e",
                ],
              },
            },
            additionalProperties: false,
            required: [
              "Name",
              "Email",
              "Principal_Investigator ORCID Text (10624734)",
              "IJC_institution-company",
            ],
          },
          "@id": {
            type: "string",
            format: "uri",
          },
          "@type": {
            oneOf: [
              {
                type: "string",
                format: "uri",
              },
              {
                type: "array",
                minItems: 1,
                items: {
                  type: "string",
                  format: "uri",
                },
                uniqueItems: true,
              },
            ],
          },
          Name: {
            "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
            "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
            "pav:createdOn": "2024-09-13T06:57:55-07:00",
            "pav:lastUpdatedOn": "2024-09-13T06:57:55-07:00",
            "@type": "https://schema.metadatacenter.org/core/TemplateField",
            "@id": "https://repo.metadatacenter.org/template-fields/868e28c2-5a62-4d48-879b-1b8ad3f2ed6d",
            type: "object",
            title: "Name field schema",
            description: "Name field schema generated by the CEDAR Artifact Library",
            "schema:name": "Name",
            "schema:description": "",
            "schema:schemaVersion": "1.6.0",
            "schema:identifier": "71_Wa_cj2ig",
            "pav:version": "1.0.0",
            "bibo:status": "bibo:published",
            "@context": {
              schema: "http://schema.org/",
              pav: "http://purl.org/pav/",
              xsd: "http://www.w3.org/2001/XMLSchema#",
              skos: "http://www.w3.org/2004/02/skos/core#",
              bibo: "http://purl.org/ontology/bibo/",
              oslc: "http://open-services.net/ns/core#",
              "schema:name": {
                "@type": "xsd:string",
              },
              "schema:description": {
                "@type": "xsd:string",
              },
              "pav:createdOn": {
                "@type": "xsd:dateTime",
              },
              "pav:createdBy": {
                "@type": "@id",
              },
              "pav:lastUpdatedOn": {
                "@type": "xsd:dateTime",
              },
              "oslc:modifiedBy": {
                "@type": "@id",
              },
              "skos:prefLabel": {
                "@type": "xsd:string",
              },
              "skos:altLabel": {
                "@type": "xsd:string",
              },
            },
            properties: {
              "@type": {
                oneOf: [
                  {
                    type: "string",
                    format: "uri",
                  },
                  {
                    type: "array",
                    minItems: 1,
                    items: {
                      type: "string",
                      format: "uri",
                    },
                    uniqueItems: true,
                  },
                ],
              },
              "rdfs:label": {
                type: [
                  "string",
                  "null",
                ],
              },
              "@value": {
                type: [
                  "string",
                  "null",
                ],
              },
            },
            additionalProperties: false,
            _valueConstraints: {
              literals: [
              ],
              requiredValue: false,
              multipleChoice: false,
            },
            "skos:prefLabel": "Name",
            "skos:altLabel": [
              "Name",
            ],
            _ui: {
              inputType: "textfield",
            },
            $schema: "http://json-schema.org/draft-04/schema#",
            _path: "IJC_PI_contact_info.Name",
            _tmp: {
              nested: true,
            },
          },
          Email: {
            "@type": "https://schema.metadatacenter.org/core/TemplateField",
            "@context": {
              xsd: "http://www.w3.org/2001/XMLSchema#",
              pav: "http://purl.org/pav/",
              bibo: "http://purl.org/ontology/bibo/",
              oslc: "http://open-services.net/ns/core#",
              schema: "http://schema.org/",
              skos: "http://www.w3.org/2004/02/skos/core#",
              "schema:name": {
                "@type": "xsd:string",
              },
              "schema:description": {
                "@type": "xsd:string",
              },
              "skos:prefLabel": {
                "@type": "xsd:string",
              },
              "skos:altLabel": {
                "@type": "xsd:string",
              },
              "pav:createdOn": {
                "@type": "xsd:dateTime",
              },
              "pav:createdBy": {
                "@type": "@id",
              },
              "pav:lastUpdatedOn": {
                "@type": "xsd:dateTime",
              },
              "oslc:modifiedBy": {
                "@type": "@id",
              },
            },
            type: "object",
            title: "Email field schema",
            description: "Email field schema generated by the CEDAR Template Editor 2.6.62",
            _ui: {
              inputType: "email",
            },
            _valueConstraints: {
              requiredValue: false,
            },
            properties: {
              "@type": {
                oneOf: [
                  {
                    type: "string",
                    format: "uri",
                  },
                  {
                    type: "array",
                    minItems: 1,
                    items: {
                      type: "string",
                      format: "uri",
                    },
                    uniqueItems: true,
                  },
                ],
              },
              "@value": {
                type: [
                  "string",
                  "null",
                ],
              },
              "rdfs:label": {
                type: [
                  "string",
                  "null",
                ],
              },
            },
            required: [
              "@value",
            ],
            "schema:name": "Email",
            "schema:description": "",
            "pav:createdOn": "2024-09-13T06:57:55-07:00",
            "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
            "pav:lastUpdatedOn": "2024-09-13T06:57:55-07:00",
            "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
            "schema:schemaVersion": "1.6.0",
            additionalProperties: false,
            "skos:prefLabel": "Email",
            "@id": "https://repo.metadatacenter.org/template-fields/85ea1946-39ea-4905-85ee-2b28658033ac",
            $schema: "http://json-schema.org/draft-04/schema#",
            _path: "IJC_PI_contact_info.Email",
            _tmp: {
              nested: true,
            },
          },
          "Principal_Investigator ORCID Text (10624734)": {
            "bibo:status": "bibo:published",
            "pav:version": "1.0.0",
            "@type": "https://schema.metadatacenter.org/core/TemplateField",
            "pav:createdOn": "2024-09-13T06:57:55-07:00",
            description: "'Principal_Investigator ORCID Text' field schema generated by the CEDAR Template Editor",
            type: "object",
            title: "'Principal_Investigator ORCID Text' field schema",
            "schema:schemaVersion": "1.6.0",
            "@context": {
              schema: "http://schema.org/",
              pav: "http://purl.org/pav/",
              xsd: "http://www.w3.org/2001/XMLSchema#",
              "pav:createdOn": {
                "@type": "xsd:dateTime",
              },
              skos: "http://www.w3.org/2004/02/skos/core#",
              oslc: "http://open-services.net/ns/core#",
              "skos:altLabel": {
                "@type": "xsd:string",
              },
              "pav:createdBy": {
                "@type": "@id",
              },
              "skos:prefLabel": {
                "@type": "xsd:string",
              },
              "schema:description": {
                "@type": "xsd:string",
              },
              "oslc:modifiedBy": {
                "@type": "@id",
              },
              "pav:lastUpdatedOn": {
                "@type": "xsd:dateTime",
              },
              bibo: "http://purl.org/ontology/bibo/",
              "schema:name": {
                "@type": "xsd:string",
              },
            },
            required: [
              "@value",
            ],
            "schema:identifier": "10624734",
            "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
            "skos:prefLabel": "ORCID",
            _ui: {
              inputType: "textfield",
            },
            _valueConstraints: {
              multipleChoice: false,
              maxLength: 255,
              requiredValue: false,
            },
            "schema:description": "A persistent unique digital identifier assigned to a principal investigator by the Open Researcher and Contributor ID (ORCID) organization.",
            "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
            "pav:lastUpdatedOn": "2024-09-13T06:57:55-07:00",
            "@id": "https://repo.metadatacenter.org/template-fields/86274eaa-cb94-4c68-b5f3-5f4d036a419a",
            additionalProperties: false,
            "schema:name": "Principal_Investigator ORCID Text (10624734)",
            properties: {
              "@type": {
                oneOf: [
                  {
                    format: "uri",
                    type: "string",
                  },
                  {
                    minItems: 1,
                    uniqueItems: true,
                    type: "array",
                    items: {
                      format: "uri",
                      type: "string",
                    },
                  },
                ],
              },
              "@value": {
                type: [
                  "string",
                  "null",
                ],
              },
            },
            $schema: "http://json-schema.org/draft-04/schema#",
            _path: "IJC_PI_contact_info.Principal_Investigator ORCID Text (10624734)",
            _tmp: {
              nested: true,
            },
          },
          "IJC_institution-company": {
            "@id": "https://repo.metadatacenter.org/template-elements/914ece68-45aa-47d0-aa0b-f375ae56fa33",
            "@type": "https://schema.metadatacenter.org/core/TemplateElement",
            "@context": {
              xsd: "http://www.w3.org/2001/XMLSchema#",
              pav: "http://purl.org/pav/",
              bibo: "http://purl.org/ontology/bibo/",
              oslc: "http://open-services.net/ns/core#",
              schema: "http://schema.org/",
              "schema:name": {
                "@type": "xsd:string",
              },
              "schema:description": {
                "@type": "xsd:string",
              },
              "pav:createdOn": {
                "@type": "xsd:dateTime",
              },
              "pav:createdBy": {
                "@type": "@id",
              },
              "pav:lastUpdatedOn": {
                "@type": "xsd:dateTime",
              },
              "oslc:modifiedBy": {
                "@type": "@id",
              },
            },
            type: "object",
            title: "Ijc_institution-company element schema",
            description: "Ijc_institution-company element schema generated by the CEDAR Template Editor 2.6.62",
            _ui: {
              order: [
                "Name",
                "Address",
                "Country Name (3152016)",
              ],
              propertyLabels: {
                "Country Name (3152016)": "Country Name (3152016)",
                Name: "Name",
                Address: "Address",
              },
              propertyDescriptions: {
                "Country Name (3152016)": "Text name for a \"Country\", referring to a wide variety of dependencies, areas of special sovereignty, uninhabited islands, and other entities in addition to the traditional countries or independent states. (from CIA World Factbook 2002: http://www.cia.gov/cia/publications/factbook/docs/notesanddefs.html).",
                Name: "",
                Address: "",
              },
            },
            properties: {
              "@context": {
                type: "object",
                properties: {
                  "Country Name (3152016)": {
                    enum: [
                      "https://schema.metadatacenter.org/properties/a39768dc-6e98-4681-b9a2-ae3090679b33",
                    ],
                  },
                  Name: {
                    enum: [
                      "https://schema.metadatacenter.org/properties/d0398a63-37af-44bb-a1b6-ee37f7ddfc64",
                    ],
                  },
                  Address: {
                    enum: [
                      "https://schema.metadatacenter.org/properties/ee59a0c3-50e4-436a-b543-c760f4fd3261",
                    ],
                  },
                },
                additionalProperties: false,
                required: [
                  "Name",
                  "Address",
                  "Country Name (3152016)",
                ],
              },
              "@id": {
                type: "string",
                format: "uri",
              },
              "@type": {
                oneOf: [
                  {
                    type: "string",
                    format: "uri",
                  },
                  {
                    type: "array",
                    minItems: 1,
                    items: {
                      type: "string",
                      format: "uri",
                    },
                    uniqueItems: true,
                  },
                ],
              },
              "Country Name (3152016)": {
                "bibo:status": "bibo:published",
                "pav:version": "1.0.0",
                "@type": "https://schema.metadatacenter.org/core/TemplateField",
                "pav:createdOn": "2024-09-13T06:53:38-07:00",
                description: "The 'Country Name' field schema auto-generated by the CEDAR/CDE Tool",
                type: "object",
                title: "The 'Country Name' field schema",
                "schema:schemaVersion": "1.6.0",
                "@context": {
                  schema: "http://schema.org/",
                  pav: "http://purl.org/pav/",
                  xsd: "http://www.w3.org/2001/XMLSchema#",
                  "pav:createdOn": {
                    "@type": "xsd:dateTime",
                  },
                  skos: "http://www.w3.org/2004/02/skos/core#",
                  oslc: "http://open-services.net/ns/core#",
                  "skos:altLabel": {
                    "@type": "xsd:string",
                  },
                  "pav:createdBy": {
                    "@type": "@id",
                  },
                  "skos:prefLabel": {
                    "@type": "xsd:string",
                  },
                  "schema:description": {
                    "@type": "xsd:string",
                  },
                  "oslc:modifiedBy": {
                    "@type": "@id",
                  },
                  "pav:lastUpdatedOn": {
                    "@type": "xsd:dateTime",
                  },
                  bibo: "http://purl.org/ontology/bibo/",
                  "schema:name": {
                    "@type": "xsd:string",
                  },
                },
                "schema:identifier": "3152016",
                "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
                "skos:prefLabel": "Country",
                _ui: {
                  inputType: "textfield",
                },
                _valueConstraints: {
                  classes: [
                  ],
                  valueSets: [
                    {
                      name: "Country Name",
                      numTerms: 270,
                      vsCollection: "CADSR-VS",
                      uri: "https://cadsr.nci.nih.gov/metadata/CADSR-VS/VD3151957v1",
                    },
                  ],
                  multipleChoice: false,
                  branches: [
                  ],
                  maxLength: 40,
                  ontologies: [
                  ],
                  requiredValue: false,
                },
                "schema:description": "Text name for a \"Country\", referring to a wide variety of dependencies, areas of special sovereignty, uninhabited islands, and other entities in addition to the traditional countries or independent states. (from CIA World Factbook 2002: http://www.cia.gov/cia/publications/factbook/docs/notesanddefs.html).",
                "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
                "pav:lastUpdatedOn": "2024-09-13T06:53:38-07:00",
                "@id": "https://repo.metadatacenter.org/template-fields/80467df6-0183-48c4-820d-097995df0862",
                additionalProperties: false,
                "schema:name": "Country Name (3152016)",
                properties: {
                  "skos:notation": {
                    type: [
                      "string",
                      "null",
                    ],
                  },
                  "@id": {
                    format: "uri",
                    type: "string",
                  },
                  "rdfs:label": {
                    type: [
                      "string",
                      "null",
                    ],
                  },
                  "@type": {
                    oneOf: [
                      {
                        format: "uri",
                        type: "string",
                      },
                      {
                        minItems: 1,
                        uniqueItems: true,
                        type: "array",
                        items: {
                          format: "uri",
                          type: "string",
                        },
                      },
                    ],
                  },
                },
                $schema: "http://json-schema.org/draft-04/schema#",
                _path: "IJC_PI_contact_info.IJC_institution-company.Country Name (3152016)",
                _tmp: {
                  nested: true,
                },
              },
              Name: {
                "@type": "https://schema.metadatacenter.org/core/TemplateField",
                "@context": {
                  xsd: "http://www.w3.org/2001/XMLSchema#",
                  pav: "http://purl.org/pav/",
                  bibo: "http://purl.org/ontology/bibo/",
                  oslc: "http://open-services.net/ns/core#",
                  schema: "http://schema.org/",
                  skos: "http://www.w3.org/2004/02/skos/core#",
                  "schema:name": {
                    "@type": "xsd:string",
                  },
                  "schema:description": {
                    "@type": "xsd:string",
                  },
                  "skos:prefLabel": {
                    "@type": "xsd:string",
                  },
                  "skos:altLabel": {
                    "@type": "xsd:string",
                  },
                  "pav:createdOn": {
                    "@type": "xsd:dateTime",
                  },
                  "pav:createdBy": {
                    "@type": "@id",
                  },
                  "pav:lastUpdatedOn": {
                    "@type": "xsd:dateTime",
                  },
                  "oslc:modifiedBy": {
                    "@type": "@id",
                  },
                },
                type: "object",
                title: "Name field schema",
                description: "Name field schema generated by the CEDAR Template Editor 2.6.62",
                _ui: {
                  inputType: "textfield",
                },
                _valueConstraints: {
                  requiredValue: false,
                },
                properties: {
                  "@type": {
                    oneOf: [
                      {
                        type: "string",
                        format: "uri",
                      },
                      {
                        type: "array",
                        minItems: 1,
                        items: {
                          type: "string",
                          format: "uri",
                        },
                        uniqueItems: true,
                      },
                    ],
                  },
                  "@value": {
                    type: [
                      "string",
                      "null",
                    ],
                  },
                  "rdfs:label": {
                    type: [
                      "string",
                      "null",
                    ],
                  },
                },
                required: [
                  "@value",
                ],
                "schema:name": "Name",
                "schema:description": "",
                "pav:createdOn": "2024-09-13T06:53:38-07:00",
                "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
                "pav:lastUpdatedOn": "2024-09-13T06:53:38-07:00",
                "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
                "schema:schemaVersion": "1.6.0",
                additionalProperties: false,
                "skos:prefLabel": "Name",
                "@id": "https://repo.metadatacenter.org/template-fields/c4045675-178d-4dc2-b5ba-5c2c3b49a0c4",
                $schema: "http://json-schema.org/draft-04/schema#",
                _path: "IJC_PI_contact_info.IJC_institution-company.Name",
                _tmp: {
                  nested: true,
                },
              },
              Address: {
                "@type": "https://schema.metadatacenter.org/core/TemplateField",
                "@context": {
                  xsd: "http://www.w3.org/2001/XMLSchema#",
                  pav: "http://purl.org/pav/",
                  bibo: "http://purl.org/ontology/bibo/",
                  oslc: "http://open-services.net/ns/core#",
                  schema: "http://schema.org/",
                  skos: "http://www.w3.org/2004/02/skos/core#",
                  "schema:name": {
                    "@type": "xsd:string",
                  },
                  "schema:description": {
                    "@type": "xsd:string",
                  },
                  "skos:prefLabel": {
                    "@type": "xsd:string",
                  },
                  "skos:altLabel": {
                    "@type": "xsd:string",
                  },
                  "pav:createdOn": {
                    "@type": "xsd:dateTime",
                  },
                  "pav:createdBy": {
                    "@type": "@id",
                  },
                  "pav:lastUpdatedOn": {
                    "@type": "xsd:dateTime",
                  },
                  "oslc:modifiedBy": {
                    "@type": "@id",
                  },
                },
                type: "object",
                title: "Address field schema",
                description: "Address field schema generated by the CEDAR Template Editor 2.6.62",
                _ui: {
                  inputType: "textfield",
                },
                _valueConstraints: {
                  requiredValue: false,
                },
                properties: {
                  "@type": {
                    oneOf: [
                      {
                        type: "string",
                        format: "uri",
                      },
                      {
                        type: "array",
                        minItems: 1,
                        items: {
                          type: "string",
                          format: "uri",
                        },
                        uniqueItems: true,
                      },
                    ],
                  },
                  "@value": {
                    type: [
                      "string",
                      "null",
                    ],
                  },
                  "rdfs:label": {
                    type: [
                      "string",
                      "null",
                    ],
                  },
                },
                required: [
                  "@value",
                ],
                "schema:name": "Address",
                "schema:description": "",
                "pav:createdOn": "2024-09-13T06:53:38-07:00",
                "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
                "pav:lastUpdatedOn": "2024-09-13T06:53:38-07:00",
                "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
                "schema:schemaVersion": "1.6.0",
                additionalProperties: false,
                "skos:prefLabel": "Address",
                "@id": "https://repo.metadatacenter.org/template-fields/9eb1175b-4ef6-470c-aff0-93ac7d52312c",
                $schema: "http://json-schema.org/draft-04/schema#",
                _path: "IJC_PI_contact_info.IJC_institution-company.Address",
                _tmp: {
                  nested: true,
                },
              },
            },
            "schema:name": "IJC_institution-company",
            "schema:description": "",
            required: [
              "@context",
              "@id",
              "Name",
              "Address",
              "Country Name (3152016)",
            ],
            "pav:createdOn": "2024-09-13T06:57:55-07:00",
            "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
            "pav:lastUpdatedOn": "2024-09-13T06:57:55-07:00",
            "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
            "schema:schemaVersion": "1.6.0",
            additionalProperties: false,
            "pav:version": "0.0.1",
            "bibo:status": "bibo:draft",
            "skos:prefLabel": "Institution / Company",
            $schema: "http://json-schema.org/draft-04/schema#",
            _tmp: {
              nested: true,
            },
          },
        },
        "schema:name": "IJC_Collaborator_contact_info",
        "schema:description": "",
        required: [
          "@context",
          "@id",
          "Name",
          "Email",
          "Principal_Investigator ORCID Text (10624734)",
          "IJC_institution-company",
        ],
        "pav:createdOn": "2024-11-20T03:41:09-08:00",
        "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
        "pav:lastUpdatedOn": "2024-11-20T03:41:09-08:00",
        "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
        "schema:schemaVersion": "1.6.0",
        additionalProperties: false,
        "pav:version": "0.0.1",
        "bibo:status": "bibo:draft",
        "skos:prefLabel": "Principal_Investigator",
        $schema: "http://json-schema.org/draft-04/schema#",
      },
    },
    required: [
      "@context",
      "@id",
      "schema:isBasedOn",
      "schema:name",
      "schema:description",
      "pav:createdOn",
      "pav:createdBy",
      "pav:lastUpdatedOn",
      "oslc:modifiedBy",
      "Project Name",
      "Consortium",
      "IJC_Collaborator_contact_info",
      "IJC_sample_metadata",
      "IJC_PI_contact_info",
    ],
    "schema:name": "Bio Forms",
    "schema:description": "",
    "pav:createdOn": "2024-09-13T06:51:10-07:00",
    "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
    "pav:lastUpdatedOn": "2024-11-20T03:41:09-08:00",
    "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
    "schema:schemaVersion": "1.6.0",
    additionalProperties: false,
    "pav:version": "0.0.1",
    "bibo:status": "bibo:draft",
    "schema:identifier": "IJC_samples_metadata",
    $schema: "http://json-schema.org/draft-04/schema#",
  },
}

const basicTemplate = {
  instance: {
    "@context": {
      rdfs: "http://www.w3.org/2000/01/rdf-schema#",
      xsd: "http://www.w3.org/2001/XMLSchema#",
      pav: "http://purl.org/pav/",
      schema: "http://schema.org/",
      oslc: "http://open-services.net/ns/core#",
      skos: "http://www.w3.org/2004/02/skos/core#",
      "rdfs:label": {
        "@type": "xsd:string",
      },
      "schema:isBasedOn": {
        "@type": "@id",
      },
      "schema:name": {
        "@type": "xsd:string",
      },
      "schema:description": {
        "@type": "xsd:string",
      },
      "pav:derivedFrom": {
        "@type": "@id",
      },
      "pav:createdOn": {
        "@type": "xsd:dateTime",
      },
      "pav:createdBy": {
        "@type": "@id",
      },
      "pav:lastUpdatedOn": {
        "@type": "xsd:dateTime",
      },
      "oslc:modifiedBy": {
        "@type": "@id",
      },
      "skos:notation": {
        "@type": "xsd:string",
      },
      IJC_Collaborator_contact_info: "https://schema.metadatacenter.org/properties/786c72ac-6dea-446f-b005-5647a8578410",
      "Project Name": "https://schema.metadatacenter.org/properties/0eeb3fa2-33d0-4b2c-8e95-f13760fca85a",
      Consortium: "https://schema.metadatacenter.org/properties/7bd33b9b-9954-4a31-9205-3938dbeface4",
      IJC_sample_metadata: "https://schema.metadatacenter.org/properties/edb45673-3c98-42f4-8624-05332fe67e14",
      IJC_PI_contact_info: "https://schema.metadatacenter.org/properties/44ea3ec8-175f-46c4-80c2-b27e818ed9cf",
    },
    IJC_Collaborator_contact_info: {
      "@context": {
        Name: "https://schema.metadatacenter.org/properties/882d1bc2-e9ad-4d26-86d2-47dbd5c32fcf",
        Email: "https://schema.metadatacenter.org/properties/623bee44-e4f2-459a-85db-abd32a638e9f",
        "Principal_Investigator ORCID Text (10624734)": "https://schema.metadatacenter.org/properties/7469493b-5033-4c1d-a53a-cff9fe78a5a2",
        "IJC_institution-company": "https://schema.metadatacenter.org/properties/45c8aeac-6b90-4862-a27e-aeaf21df935e",
      },
      Name: {
        "@value": "Collaborator",
        $$hashKey: "object:2970",
      },
      Email: {
        "@value": "collaborator@email.com",
        $$hashKey: "object:2981",
      },
      "Principal_Investigator ORCID Text (10624734)": {
        "@value": "orcidcollab",
        $$hashKey: "object:2993",
      },
      "IJC_institution-company": {
        "@context": {
          "Country Name (3152016)": "https://schema.metadatacenter.org/properties/a39768dc-6e98-4681-b9a2-ae3090679b33",
          Name: "https://schema.metadatacenter.org/properties/d0398a63-37af-44bb-a1b6-ee37f7ddfc64",
          Address: "https://schema.metadatacenter.org/properties/ee59a0c3-50e4-436a-b543-c760f4fd3261",
        },
        "Country Name (3152016)": {
          $$hashKey: "object:3036",
          "@id": "https://cadsr.nci.nih.gov/metadata/CADSR-VS/VM3152008v1",
          "rdfs:label": "United States",
          "skos:notation": "United States",
        },
        Name: {
          "@value": "institution",
          $$hashKey: "object:3012",
        },
        Address: {
          "@value": "insitutionadd",
          $$hashKey: "object:3023",
        },
        $$hashKey: "object:161",
      },
      $$hashKey: "object:76",
    },
    "Project Name": {
      "@value": "project name two",
      $$hashKey: "object:251",
    },
    Consortium: {
      "@value": "Consortiun name",
      $$hashKey: "object:268",
    },
    IJC_sample_metadata: [
      {
        "@context": {
          Tumor: "https://schema.metadatacenter.org/properties/08afe47d-d9fc-4290-aff3-d2fcb3873f92",
          Control: "https://schema.metadatacenter.org/properties/4767ed7e-d048-4941-8e4e-8d945729a243",
          Disease: "https://schema.metadatacenter.org/properties/51bcb11f-e124-45fc-bcca-82899f4d68f3",
          "Primary culture": "https://schema.metadatacenter.org/properties/5454767d-c051-4108-9930-3ff3955918f8",
          "Sample Provider": "https://schema.metadatacenter.org/properties/88647f3a-d381-4f6c-bb42-ad82ed669760",
          "Other species": "https://schema.metadatacenter.org/properties/70cc6996-0a8f-44c6-9d49-f935d221cd00",
          Sex: "https://schema.metadatacenter.org/properties/9da9f3d4-8067-4e70-a3f0-191bcf472101",
          "Development stage": "https://schema.metadatacenter.org/properties/7291a2b8-46b5-40d2-b133-3c390eee524d",
          "Sample origin": "https://schema.metadatacenter.org/properties/47a9e48a-489a-473b-a08a-211ca95cc71a",
          Celltype: "https://schema.metadatacenter.org/properties/6d2cd38e-5154-49d7-8c5d-b392cc2399a1",
          "Treatment specify": "https://schema.metadatacenter.org/properties/4325e81c-52eb-4a5b-b976-f2ff76ebf8e0",
          "Cell Line Name": "https://schema.metadatacenter.org/properties/5dc4dbdf-888d-444f-b81f-e2376bb4f256",
          "Tumor subtype": "https://schema.metadatacenter.org/properties/11e5c598-dfa1-4683-a46b-0d729f9c6d50",
          Treatement: "https://schema.metadatacenter.org/properties/e1979247-df90-45f3-a69d-253d14c12500",
          "Patient clinical data available": "https://schema.metadatacenter.org/properties/d5d85810-861d-4796-bcf6-be601cb8a054",
          "Patient survival data available": "https://schema.metadatacenter.org/properties/bc6ea875-b1fc-4a57-ac3e-dab0158b22c7",
          "Sample name": "https://schema.metadatacenter.org/properties/21be2752-1b07-48cb-8e57-3bcdf2b38071",
          "Sample preservation": "https://schema.metadatacenter.org/properties/6c9337ac-bde5-4822-a6b5-f16da380f53d",
          "DNA concentration measure technology": "https://schema.metadatacenter.org/properties/13744bf3-a684-4da7-be49-d6f9e1850c3a",
          Notes: "https://schema.metadatacenter.org/properties/23f5d351-7f22-45f3-883a-38f62c7d4b47",
          Species: "https://schema.metadatacenter.org/properties/d2e521c3-4a09-4837-a023-bb2f161a0afa",
          "Age value": "https://schema.metadatacenter.org/properties/4e4900c7-a23a-4f90-b8d9-f25d9262dcb6",
          "Age unit": "https://schema.metadatacenter.org/properties/e933f973-7fcb-4c87-bbdd-71ba96c93abd",
        },
        Tumor: {
          "@value": "Metastasis",
        },
        Control: {
          "@value": "Yes",
        },
        Disease: {
          "@id": "http://purl.obolibrary.org/obo/DOID_0001816",
          "rdfs:label": "angiosarcoma",
        },
        "Primary culture": {
          "@value": "no",
        },
        "Sample Provider": {
          "@value": "sample provider 1 ",
        },
        "Other species": {
          "@value": "asd",
        },
        Sex: {
          "@value": "Female",
        },
        "Development stage": {
          "@value": "Adult",
        },
        "Sample origin": {
          "@id": "http://purl.obolibrary.org/obo/UBERON_2000089",
          "rdfs:label": "actinotrichium",
        },
        Celltype: {
          "@id": "http://purl.obolibrary.org/obo/BTO_0000054",
          "rdfs:label": "albumen gland",
        },
        "Treatment specify": {
          "@value": "asdasd",
        },
        "Cell Line Name": {
          "@value": "cell line 1",
        },
        "Tumor subtype": {
          "@id": "http://purl.bioontology.org/ontology/SNOMEDCT/103690005",
          "rdfs:label": "Acute myeloid leukemia without maturation",
        },
        Treatement: {
          "@value": "No",
        },
        "Patient clinical data available": {
          "@value": "No",
        },
        "Patient survival data available": {
          "@value": "No",
        },
        "Sample name": {
          "@value": "sample name 1",
        },
        "Sample preservation": {
          "@value": "FF_DNA",
        },
        "DNA concentration measure technology": {
          "@value": "Other",
        },
        Notes: {
          "@value": "asda sdasd",
        },
        Species: {
          "@value": "Homo sapiens",
        },
        "Age value": {
          "@value": "30",
          "@type": "xsd:decimal",
        },
        "Age unit": {
          "@value": "Years",
        },
      },
      {
        "@context": {
          Tumor: "https://schema.metadatacenter.org/properties/08afe47d-d9fc-4290-aff3-d2fcb3873f92",
          Control: "https://schema.metadatacenter.org/properties/4767ed7e-d048-4941-8e4e-8d945729a243",
          Disease: "https://schema.metadatacenter.org/properties/51bcb11f-e124-45fc-bcca-82899f4d68f3",
          "Primary culture": "https://schema.metadatacenter.org/properties/5454767d-c051-4108-9930-3ff3955918f8",
          "Sample Provider": "https://schema.metadatacenter.org/properties/88647f3a-d381-4f6c-bb42-ad82ed669760",
          "Other species": "https://schema.metadatacenter.org/properties/70cc6996-0a8f-44c6-9d49-f935d221cd00",
          Sex: "https://schema.metadatacenter.org/properties/9da9f3d4-8067-4e70-a3f0-191bcf472101",
          "Development stage": "https://schema.metadatacenter.org/properties/7291a2b8-46b5-40d2-b133-3c390eee524d",
          "Sample origin": "https://schema.metadatacenter.org/properties/47a9e48a-489a-473b-a08a-211ca95cc71a",
          Celltype: "https://schema.metadatacenter.org/properties/6d2cd38e-5154-49d7-8c5d-b392cc2399a1",
          "Treatment specify": "https://schema.metadatacenter.org/properties/4325e81c-52eb-4a5b-b976-f2ff76ebf8e0",
          "Cell Line Name": "https://schema.metadatacenter.org/properties/5dc4dbdf-888d-444f-b81f-e2376bb4f256",
          "Tumor subtype": "https://schema.metadatacenter.org/properties/11e5c598-dfa1-4683-a46b-0d729f9c6d50",
          Treatement: "https://schema.metadatacenter.org/properties/e1979247-df90-45f3-a69d-253d14c12500",
          "Patient clinical data available": "https://schema.metadatacenter.org/properties/d5d85810-861d-4796-bcf6-be601cb8a054",
          "Patient survival data available": "https://schema.metadatacenter.org/properties/bc6ea875-b1fc-4a57-ac3e-dab0158b22c7",
          "Sample name": "https://schema.metadatacenter.org/properties/21be2752-1b07-48cb-8e57-3bcdf2b38071",
          "Sample preservation": "https://schema.metadatacenter.org/properties/6c9337ac-bde5-4822-a6b5-f16da380f53d",
          "DNA concentration measure technology": "https://schema.metadatacenter.org/properties/13744bf3-a684-4da7-be49-d6f9e1850c3a",
          Notes: "https://schema.metadatacenter.org/properties/23f5d351-7f22-45f3-883a-38f62c7d4b47",
          Species: "https://schema.metadatacenter.org/properties/d2e521c3-4a09-4837-a023-bb2f161a0afa",
          "Age value": "https://schema.metadatacenter.org/properties/4e4900c7-a23a-4f90-b8d9-f25d9262dcb6",
          "Age unit": "https://schema.metadatacenter.org/properties/e933f973-7fcb-4c87-bbdd-71ba96c93abd",
        },
        Tumor: {
          "@value": "Metastasis",
        },
        Control: {
          "@value": "Yes",
        },
        Disease: {
          "@id": "http://purl.obolibrary.org/obo/DOID_0001816",
          "rdfs:label": "angiosarcoma",
        },
        "Primary culture": {
          "@value": "no",
        },
        "Sample Provider": {
          "@value": "sample provider 1 ",
        },
        "Other species": {
          "@value": "asd",
        },
        Sex: {
          "@value": "Female",
        },
        "Development stage": {
          "@value": "Adult",
        },
        "Sample origin": {
          "@id": "http://purl.obolibrary.org/obo/UBERON_2000089",
          "rdfs:label": "actinotrichium",
        },
        Celltype: {
          "@id": "http://purl.obolibrary.org/obo/BTO_0000054",
          "rdfs:label": "albumen gland",
        },
        "Treatment specify": {
          "@value": "asdasd",
        },
        "Cell Line Name": {
          "@value": "cell line 1",
        },
        "Tumor subtype": {
          "@id": "http://purl.bioontology.org/ontology/SNOMEDCT/103690005",
          "rdfs:label": "Acute myeloid leukemia without maturation",
        },
        Treatement: {
          "@value": "No",
        },
        "Patient clinical data available": {
          "@value": "No",
        },
        "Patient survival data available": {
          "@value": "No",
        },
        "Sample name": {
          "@value": "sample name 1",
        },
        "Sample preservation": {
          "@value": "FF_DNA",
        },
        "DNA concentration measure technology": {
          "@value": "Other",
        },
        Notes: {
          "@value": "asda sdasd",
        },
        Species: {
          "@value": "Homo sapiens",
        },
        "Age value": {
          "@value": "30",
          "@type": "xsd:decimal",
        },
        "Age unit": {
          "@value": "Years",
        },
      },
      {
        "@context": {
          Tumor: "https://schema.metadatacenter.org/properties/08afe47d-d9fc-4290-aff3-d2fcb3873f92",
          Control: "https://schema.metadatacenter.org/properties/4767ed7e-d048-4941-8e4e-8d945729a243",
          Disease: "https://schema.metadatacenter.org/properties/51bcb11f-e124-45fc-bcca-82899f4d68f3",
          "Primary culture": "https://schema.metadatacenter.org/properties/5454767d-c051-4108-9930-3ff3955918f8",
          "Sample Provider": "https://schema.metadatacenter.org/properties/88647f3a-d381-4f6c-bb42-ad82ed669760",
          "Other species": "https://schema.metadatacenter.org/properties/70cc6996-0a8f-44c6-9d49-f935d221cd00",
          Sex: "https://schema.metadatacenter.org/properties/9da9f3d4-8067-4e70-a3f0-191bcf472101",
          "Development stage": "https://schema.metadatacenter.org/properties/7291a2b8-46b5-40d2-b133-3c390eee524d",
          "Sample origin": "https://schema.metadatacenter.org/properties/47a9e48a-489a-473b-a08a-211ca95cc71a",
          Celltype: "https://schema.metadatacenter.org/properties/6d2cd38e-5154-49d7-8c5d-b392cc2399a1",
          "Treatment specify": "https://schema.metadatacenter.org/properties/4325e81c-52eb-4a5b-b976-f2ff76ebf8e0",
          "Cell Line Name": "https://schema.metadatacenter.org/properties/5dc4dbdf-888d-444f-b81f-e2376bb4f256",
          "Tumor subtype": "https://schema.metadatacenter.org/properties/11e5c598-dfa1-4683-a46b-0d729f9c6d50",
          Treatement: "https://schema.metadatacenter.org/properties/e1979247-df90-45f3-a69d-253d14c12500",
          "Patient clinical data available": "https://schema.metadatacenter.org/properties/d5d85810-861d-4796-bcf6-be601cb8a054",
          "Patient survival data available": "https://schema.metadatacenter.org/properties/bc6ea875-b1fc-4a57-ac3e-dab0158b22c7",
          "Sample name": "https://schema.metadatacenter.org/properties/21be2752-1b07-48cb-8e57-3bcdf2b38071",
          "Sample preservation": "https://schema.metadatacenter.org/properties/6c9337ac-bde5-4822-a6b5-f16da380f53d",
          "DNA concentration measure technology": "https://schema.metadatacenter.org/properties/13744bf3-a684-4da7-be49-d6f9e1850c3a",
          Notes: "https://schema.metadatacenter.org/properties/23f5d351-7f22-45f3-883a-38f62c7d4b47",
          Species: "https://schema.metadatacenter.org/properties/d2e521c3-4a09-4837-a023-bb2f161a0afa",
          "Age value": "https://schema.metadatacenter.org/properties/4e4900c7-a23a-4f90-b8d9-f25d9262dcb6",
          "Age unit": "https://schema.metadatacenter.org/properties/e933f973-7fcb-4c87-bbdd-71ba96c93abd",
        },
        Tumor: {
          "@value": "Metastasis",
        },
        Control: {
          "@value": "Yes",
        },
        Disease: {
          "@id": "http://purl.obolibrary.org/obo/DOID_0001816",
          "rdfs:label": "angiosarcoma",
        },
        "Primary culture": {
          "@value": "no",
        },
        "Sample Provider": {
          "@value": "sample provider 1 ",
        },
        "Other species": {
          "@value": "asd",
        },
        Sex: {
          "@value": "Female",
        },
        "Development stage": {
          "@value": "Adult",
        },
        "Sample origin": {
          "@id": "http://purl.obolibrary.org/obo/UBERON_2000089",
          "rdfs:label": "actinotrichium",
        },
        Celltype: {
          "@id": "http://purl.obolibrary.org/obo/BTO_0000054",
          "rdfs:label": "albumen gland",
        },
        "Treatment specify": {
          "@value": "asdasd",
        },
        "Cell Line Name": {
          "@value": "cell line 1",
        },
        "Tumor subtype": {
          "@id": "http://purl.bioontology.org/ontology/SNOMEDCT/103690005",
          "rdfs:label": "Acute myeloid leukemia without maturation",
        },
        Treatement: {
          "@value": "No",
        },
        "Patient clinical data available": {
          "@value": "No",
        },
        "Patient survival data available": {
          "@value": "No",
        },
        "Sample name": {
          "@value": "sample name 1",
        },
        "Sample preservation": {
          "@value": "FF_DNA",
        },
        "DNA concentration measure technology": {
          "@value": "Other",
        },
        Notes: {
          "@value": "asda sdasd",
        },
        Species: {
          "@value": "Homo sapiens",
        },
        "Age value": {
          "@value": "30",
          "@type": "xsd:decimal",
        },
        "Age unit": {
          "@value": "Years",
        },
      },
      {
        "@context": {
          Tumor: "https://schema.metadatacenter.org/properties/08afe47d-d9fc-4290-aff3-d2fcb3873f92",
          Control: "https://schema.metadatacenter.org/properties/4767ed7e-d048-4941-8e4e-8d945729a243",
          Disease: "https://schema.metadatacenter.org/properties/51bcb11f-e124-45fc-bcca-82899f4d68f3",
          "Primary culture": "https://schema.metadatacenter.org/properties/5454767d-c051-4108-9930-3ff3955918f8",
          "Sample Provider": "https://schema.metadatacenter.org/properties/88647f3a-d381-4f6c-bb42-ad82ed669760",
          "Other species": "https://schema.metadatacenter.org/properties/70cc6996-0a8f-44c6-9d49-f935d221cd00",
          Sex: "https://schema.metadatacenter.org/properties/9da9f3d4-8067-4e70-a3f0-191bcf472101",
          "Development stage": "https://schema.metadatacenter.org/properties/7291a2b8-46b5-40d2-b133-3c390eee524d",
          "Sample origin": "https://schema.metadatacenter.org/properties/47a9e48a-489a-473b-a08a-211ca95cc71a",
          Celltype: "https://schema.metadatacenter.org/properties/6d2cd38e-5154-49d7-8c5d-b392cc2399a1",
          "Treatment specify": "https://schema.metadatacenter.org/properties/4325e81c-52eb-4a5b-b976-f2ff76ebf8e0",
          "Cell Line Name": "https://schema.metadatacenter.org/properties/5dc4dbdf-888d-444f-b81f-e2376bb4f256",
          "Tumor subtype": "https://schema.metadatacenter.org/properties/11e5c598-dfa1-4683-a46b-0d729f9c6d50",
          Treatement: "https://schema.metadatacenter.org/properties/e1979247-df90-45f3-a69d-253d14c12500",
          "Patient clinical data available": "https://schema.metadatacenter.org/properties/d5d85810-861d-4796-bcf6-be601cb8a054",
          "Patient survival data available": "https://schema.metadatacenter.org/properties/bc6ea875-b1fc-4a57-ac3e-dab0158b22c7",
          "Sample name": "https://schema.metadatacenter.org/properties/21be2752-1b07-48cb-8e57-3bcdf2b38071",
          "Sample preservation": "https://schema.metadatacenter.org/properties/6c9337ac-bde5-4822-a6b5-f16da380f53d",
          "DNA concentration measure technology": "https://schema.metadatacenter.org/properties/13744bf3-a684-4da7-be49-d6f9e1850c3a",
          Notes: "https://schema.metadatacenter.org/properties/23f5d351-7f22-45f3-883a-38f62c7d4b47",
          Species: "https://schema.metadatacenter.org/properties/d2e521c3-4a09-4837-a023-bb2f161a0afa",
          "Age value": "https://schema.metadatacenter.org/properties/4e4900c7-a23a-4f90-b8d9-f25d9262dcb6",
          "Age unit": "https://schema.metadatacenter.org/properties/e933f973-7fcb-4c87-bbdd-71ba96c93abd",
        },
        Tumor: {
          "@value": "Metastasis",
        },
        Control: {
          "@value": "Yes",
        },
        Disease: {
          "@id": "http://purl.obolibrary.org/obo/DOID_0001816",
          "rdfs:label": "angiosarcoma",
        },
        "Primary culture": {
          "@value": "no",
        },
        "Sample Provider": {
          "@value": "sample provider 1 ",
        },
        "Other species": {
          "@value": "asd",
        },
        Sex: {
          "@value": "Female",
        },
        "Development stage": {
          "@value": "Adult",
        },
        "Sample origin": {
          "@id": "http://purl.obolibrary.org/obo/UBERON_2000089",
          "rdfs:label": "actinotrichium",
        },
        Celltype: {
          "@id": "http://purl.obolibrary.org/obo/BTO_0000054",
          "rdfs:label": "albumen gland",
        },
        "Treatment specify": {
          "@value": "asdasd",
        },
        "Cell Line Name": {
          "@value": "cell line 1",
        },
        "Tumor subtype": {
          "@id": "http://purl.bioontology.org/ontology/SNOMEDCT/103690005",
          "rdfs:label": "Acute myeloid leukemia without maturation",
        },
        Treatement: {
          "@value": "No",
        },
        "Patient clinical data available": {
          "@value": "No",
        },
        "Patient survival data available": {
          "@value": "No",
        },
        "Sample name": {
          "@value": "sample name 1",
        },
        "Sample preservation": {
          "@value": "FF_DNA",
        },
        "DNA concentration measure technology": {
          "@value": "Other",
        },
        Notes: {
          "@value": "asda sdasd",
        },
        Species: {
          "@value": "Homo sapiens",
        },
        "Age value": {
          "@type": "xsd:decimal",
          "@value": "30",
        },
        "Age unit": {
          "@value": "Years",
        },
      },
      {
        "@context": {
          Tumor: "https://schema.metadatacenter.org/properties/08afe47d-d9fc-4290-aff3-d2fcb3873f92",
          Control: "https://schema.metadatacenter.org/properties/4767ed7e-d048-4941-8e4e-8d945729a243",
          Disease: "https://schema.metadatacenter.org/properties/51bcb11f-e124-45fc-bcca-82899f4d68f3",
          "Primary culture": "https://schema.metadatacenter.org/properties/5454767d-c051-4108-9930-3ff3955918f8",
          "Sample Provider": "https://schema.metadatacenter.org/properties/88647f3a-d381-4f6c-bb42-ad82ed669760",
          "Other species": "https://schema.metadatacenter.org/properties/70cc6996-0a8f-44c6-9d49-f935d221cd00",
          Sex: "https://schema.metadatacenter.org/properties/9da9f3d4-8067-4e70-a3f0-191bcf472101",
          "Development stage": "https://schema.metadatacenter.org/properties/7291a2b8-46b5-40d2-b133-3c390eee524d",
          "Sample origin": "https://schema.metadatacenter.org/properties/47a9e48a-489a-473b-a08a-211ca95cc71a",
          Celltype: "https://schema.metadatacenter.org/properties/6d2cd38e-5154-49d7-8c5d-b392cc2399a1",
          "Treatment specify": "https://schema.metadatacenter.org/properties/4325e81c-52eb-4a5b-b976-f2ff76ebf8e0",
          "Cell Line Name": "https://schema.metadatacenter.org/properties/5dc4dbdf-888d-444f-b81f-e2376bb4f256",
          "Tumor subtype": "https://schema.metadatacenter.org/properties/11e5c598-dfa1-4683-a46b-0d729f9c6d50",
          Treatement: "https://schema.metadatacenter.org/properties/e1979247-df90-45f3-a69d-253d14c12500",
          "Patient clinical data available": "https://schema.metadatacenter.org/properties/d5d85810-861d-4796-bcf6-be601cb8a054",
          "Patient survival data available": "https://schema.metadatacenter.org/properties/bc6ea875-b1fc-4a57-ac3e-dab0158b22c7",
          "Sample name": "https://schema.metadatacenter.org/properties/21be2752-1b07-48cb-8e57-3bcdf2b38071",
          "Sample preservation": "https://schema.metadatacenter.org/properties/6c9337ac-bde5-4822-a6b5-f16da380f53d",
          "DNA concentration measure technology": "https://schema.metadatacenter.org/properties/13744bf3-a684-4da7-be49-d6f9e1850c3a",
          Notes: "https://schema.metadatacenter.org/properties/23f5d351-7f22-45f3-883a-38f62c7d4b47",
          Species: "https://schema.metadatacenter.org/properties/d2e521c3-4a09-4837-a023-bb2f161a0afa",
          "Age value": "https://schema.metadatacenter.org/properties/4e4900c7-a23a-4f90-b8d9-f25d9262dcb6",
          "Age unit": "https://schema.metadatacenter.org/properties/e933f973-7fcb-4c87-bbdd-71ba96c93abd",
        },
        Tumor: {
          "@value": null,
        },
        Control: {
          "@value": null,
        },
        Disease: {
        },
        "Primary culture": {
          "@value": null,
        },
        "Sample Provider": {
          "@value": null,
        },
        "Other species": {
          "@value": null,
        },
        Sex: {
          "@value": null,
        },
        "Development stage": {
          "@value": null,
        },
        "Sample origin": {
        },
        Celltype: {
        },
        "Treatment specify": {
          "@value": null,
        },
        "Cell Line Name": {
          "@value": null,
        },
        "Tumor subtype": {
        },
        Treatement: {
          "@value": null,
        },
        "Patient clinical data available": {
          "@value": null,
        },
        "Patient survival data available": {
          "@value": null,
        },
        "Sample name": {
          "@value": "sample name 1",
        },
        "Sample preservation": {
          "@value": null,
        },
        "DNA concentration measure technology": {
          "@value": null,
        },
        Notes: {
          "@value": null,
        },
        Species: {
          "@value": null,
        },
        "Age value": {
          "@type": "xsd:decimal",
        },
        "Age unit": {
          "@value": null,
        },
      },
      {
        "@context": {
          Tumor: "https://schema.metadatacenter.org/properties/08afe47d-d9fc-4290-aff3-d2fcb3873f92",
          Control: "https://schema.metadatacenter.org/properties/4767ed7e-d048-4941-8e4e-8d945729a243",
          Disease: "https://schema.metadatacenter.org/properties/51bcb11f-e124-45fc-bcca-82899f4d68f3",
          "Primary culture": "https://schema.metadatacenter.org/properties/5454767d-c051-4108-9930-3ff3955918f8",
          "Sample Provider": "https://schema.metadatacenter.org/properties/88647f3a-d381-4f6c-bb42-ad82ed669760",
          "Other species": "https://schema.metadatacenter.org/properties/70cc6996-0a8f-44c6-9d49-f935d221cd00",
          Sex: "https://schema.metadatacenter.org/properties/9da9f3d4-8067-4e70-a3f0-191bcf472101",
          "Development stage": "https://schema.metadatacenter.org/properties/7291a2b8-46b5-40d2-b133-3c390eee524d",
          "Sample origin": "https://schema.metadatacenter.org/properties/47a9e48a-489a-473b-a08a-211ca95cc71a",
          Celltype: "https://schema.metadatacenter.org/properties/6d2cd38e-5154-49d7-8c5d-b392cc2399a1",
          "Treatment specify": "https://schema.metadatacenter.org/properties/4325e81c-52eb-4a5b-b976-f2ff76ebf8e0",
          "Cell Line Name": "https://schema.metadatacenter.org/properties/5dc4dbdf-888d-444f-b81f-e2376bb4f256",
          "Tumor subtype": "https://schema.metadatacenter.org/properties/11e5c598-dfa1-4683-a46b-0d729f9c6d50",
          Treatement: "https://schema.metadatacenter.org/properties/e1979247-df90-45f3-a69d-253d14c12500",
          "Patient clinical data available": "https://schema.metadatacenter.org/properties/d5d85810-861d-4796-bcf6-be601cb8a054",
          "Patient survival data available": "https://schema.metadatacenter.org/properties/bc6ea875-b1fc-4a57-ac3e-dab0158b22c7",
          "Sample name": "https://schema.metadatacenter.org/properties/21be2752-1b07-48cb-8e57-3bcdf2b38071",
          "Sample preservation": "https://schema.metadatacenter.org/properties/6c9337ac-bde5-4822-a6b5-f16da380f53d",
          "DNA concentration measure technology": "https://schema.metadatacenter.org/properties/13744bf3-a684-4da7-be49-d6f9e1850c3a",
          Notes: "https://schema.metadatacenter.org/properties/23f5d351-7f22-45f3-883a-38f62c7d4b47",
          Species: "https://schema.metadatacenter.org/properties/d2e521c3-4a09-4837-a023-bb2f161a0afa",
          "Age value": "https://schema.metadatacenter.org/properties/4e4900c7-a23a-4f90-b8d9-f25d9262dcb6",
          "Age unit": "https://schema.metadatacenter.org/properties/e933f973-7fcb-4c87-bbdd-71ba96c93abd",
        },
        Tumor: {
          "@value": "Metastasis",
        },
        Control: {
          "@value": "Yes",
        },
        Disease: {
          "@id": "http://purl.obolibrary.org/obo/DOID_0001816",
          "rdfs:label": "angiosarcoma",
        },
        "Primary culture": {
          "@value": "no",
        },
        "Sample Provider": {
          "@value": "sample provider 1 ",
        },
        "Other species": {
          "@value": "asd",
        },
        Sex: {
          "@value": "Female",
        },
        "Development stage": {
          "@value": "Adult",
        },
        "Sample origin": {
          "@id": "http://purl.obolibrary.org/obo/UBERON_2000089",
          "rdfs:label": "actinotrichium",
        },
        Celltype: {
          "@id": "http://purl.obolibrary.org/obo/BTO_0000054",
          "rdfs:label": "albumen gland",
        },
        "Treatment specify": {
          "@value": "asdasd",
        },
        "Cell Line Name": {
          "@value": "cell line 1",
        },
        "Tumor subtype": {
          "@id": "http://purl.bioontology.org/ontology/SNOMEDCT/103690005",
          "rdfs:label": "Acute myeloid leukemia without maturation",
        },
        Treatement: {
          "@value": "No",
        },
        "Patient clinical data available": {
          "@value": "No",
        },
        "Patient survival data available": {
          "@value": "No",
        },
        "Sample name": {
          "@value": "sample name 1",
        },
        "Sample preservation": {
          "@value": "FF_DNA",
        },
        "DNA concentration measure technology": {
          "@value": "Other",
        },
        Notes: {
          "@value": "asda sdasd",
        },
        Species: {
          "@value": "Homo sapiens",
        },
        "Age value": {
          "@type": "xsd:decimal",
          "@value": "30",
        },
        "Age unit": {
          "@value": "Years",
        },
      },
      {
        "@context": {
          Tumor: "https://schema.metadatacenter.org/properties/08afe47d-d9fc-4290-aff3-d2fcb3873f92",
          Control: "https://schema.metadatacenter.org/properties/4767ed7e-d048-4941-8e4e-8d945729a243",
          Disease: "https://schema.metadatacenter.org/properties/51bcb11f-e124-45fc-bcca-82899f4d68f3",
          "Primary culture": "https://schema.metadatacenter.org/properties/5454767d-c051-4108-9930-3ff3955918f8",
          "Sample Provider": "https://schema.metadatacenter.org/properties/88647f3a-d381-4f6c-bb42-ad82ed669760",
          "Other species": "https://schema.metadatacenter.org/properties/70cc6996-0a8f-44c6-9d49-f935d221cd00",
          Sex: "https://schema.metadatacenter.org/properties/9da9f3d4-8067-4e70-a3f0-191bcf472101",
          "Development stage": "https://schema.metadatacenter.org/properties/7291a2b8-46b5-40d2-b133-3c390eee524d",
          "Sample origin": "https://schema.metadatacenter.org/properties/47a9e48a-489a-473b-a08a-211ca95cc71a",
          Celltype: "https://schema.metadatacenter.org/properties/6d2cd38e-5154-49d7-8c5d-b392cc2399a1",
          "Treatment specify": "https://schema.metadatacenter.org/properties/4325e81c-52eb-4a5b-b976-f2ff76ebf8e0",
          "Cell Line Name": "https://schema.metadatacenter.org/properties/5dc4dbdf-888d-444f-b81f-e2376bb4f256",
          "Tumor subtype": "https://schema.metadatacenter.org/properties/11e5c598-dfa1-4683-a46b-0d729f9c6d50",
          Treatement: "https://schema.metadatacenter.org/properties/e1979247-df90-45f3-a69d-253d14c12500",
          "Patient clinical data available": "https://schema.metadatacenter.org/properties/d5d85810-861d-4796-bcf6-be601cb8a054",
          "Patient survival data available": "https://schema.metadatacenter.org/properties/bc6ea875-b1fc-4a57-ac3e-dab0158b22c7",
          "Sample name": "https://schema.metadatacenter.org/properties/21be2752-1b07-48cb-8e57-3bcdf2b38071",
          "Sample preservation": "https://schema.metadatacenter.org/properties/6c9337ac-bde5-4822-a6b5-f16da380f53d",
          "DNA concentration measure technology": "https://schema.metadatacenter.org/properties/13744bf3-a684-4da7-be49-d6f9e1850c3a",
          Notes: "https://schema.metadatacenter.org/properties/23f5d351-7f22-45f3-883a-38f62c7d4b47",
          Species: "https://schema.metadatacenter.org/properties/d2e521c3-4a09-4837-a023-bb2f161a0afa",
          "Age value": "https://schema.metadatacenter.org/properties/4e4900c7-a23a-4f90-b8d9-f25d9262dcb6",
          "Age unit": "https://schema.metadatacenter.org/properties/e933f973-7fcb-4c87-bbdd-71ba96c93abd",
        },
        Tumor: {
          "@value": null,
        },
        Control: {
          "@value": null,
        },
        Disease: {
        },
        "Primary culture": {
          "@value": null,
        },
        "Sample Provider": {
          "@value": null,
        },
        "Other species": {
          "@value": null,
        },
        Sex: {
          "@value": null,
        },
        "Development stage": {
          "@value": null,
        },
        "Sample origin": {
        },
        Celltype: {
        },
        "Treatment specify": {
          "@value": null,
        },
        "Cell Line Name": {
          "@value": null,
        },
        "Tumor subtype": {
        },
        Treatement: {
          "@value": null,
        },
        "Patient clinical data available": {
          "@value": null,
        },
        "Patient survival data available": {
          "@value": null,
        },
        "Sample name": {
          "@value": null,
        },
        "Sample preservation": {
          "@value": null,
        },
        "DNA concentration measure technology": {
          "@value": null,
        },
        Notes: {
          "@value": null,
        },
        Species: {
          "@value": null,
        },
        "Age value": {
          "@type": "xsd:decimal",
        },
        "Age unit": {
          "@value": null,
        },
      },
      {
        "@context": {
          Tumor: "https://schema.metadatacenter.org/properties/08afe47d-d9fc-4290-aff3-d2fcb3873f92",
          Control: "https://schema.metadatacenter.org/properties/4767ed7e-d048-4941-8e4e-8d945729a243",
          Disease: "https://schema.metadatacenter.org/properties/51bcb11f-e124-45fc-bcca-82899f4d68f3",
          "Primary culture": "https://schema.metadatacenter.org/properties/5454767d-c051-4108-9930-3ff3955918f8",
          "Sample Provider": "https://schema.metadatacenter.org/properties/88647f3a-d381-4f6c-bb42-ad82ed669760",
          "Other species": "https://schema.metadatacenter.org/properties/70cc6996-0a8f-44c6-9d49-f935d221cd00",
          Sex: "https://schema.metadatacenter.org/properties/9da9f3d4-8067-4e70-a3f0-191bcf472101",
          "Development stage": "https://schema.metadatacenter.org/properties/7291a2b8-46b5-40d2-b133-3c390eee524d",
          "Sample origin": "https://schema.metadatacenter.org/properties/47a9e48a-489a-473b-a08a-211ca95cc71a",
          Celltype: "https://schema.metadatacenter.org/properties/6d2cd38e-5154-49d7-8c5d-b392cc2399a1",
          "Treatment specify": "https://schema.metadatacenter.org/properties/4325e81c-52eb-4a5b-b976-f2ff76ebf8e0",
          "Cell Line Name": "https://schema.metadatacenter.org/properties/5dc4dbdf-888d-444f-b81f-e2376bb4f256",
          "Tumor subtype": "https://schema.metadatacenter.org/properties/11e5c598-dfa1-4683-a46b-0d729f9c6d50",
          Treatement: "https://schema.metadatacenter.org/properties/e1979247-df90-45f3-a69d-253d14c12500",
          "Patient clinical data available": "https://schema.metadatacenter.org/properties/d5d85810-861d-4796-bcf6-be601cb8a054",
          "Patient survival data available": "https://schema.metadatacenter.org/properties/bc6ea875-b1fc-4a57-ac3e-dab0158b22c7",
          "Sample name": "https://schema.metadatacenter.org/properties/21be2752-1b07-48cb-8e57-3bcdf2b38071",
          "Sample preservation": "https://schema.metadatacenter.org/properties/6c9337ac-bde5-4822-a6b5-f16da380f53d",
          "DNA concentration measure technology": "https://schema.metadatacenter.org/properties/13744bf3-a684-4da7-be49-d6f9e1850c3a",
          Notes: "https://schema.metadatacenter.org/properties/23f5d351-7f22-45f3-883a-38f62c7d4b47",
          Species: "https://schema.metadatacenter.org/properties/d2e521c3-4a09-4837-a023-bb2f161a0afa",
          "Age value": "https://schema.metadatacenter.org/properties/4e4900c7-a23a-4f90-b8d9-f25d9262dcb6",
          "Age unit": "https://schema.metadatacenter.org/properties/e933f973-7fcb-4c87-bbdd-71ba96c93abd",
        },
        Tumor: {
          "@value": null,
        },
        Control: {
          "@value": null,
        },
        Disease: {
        },
        "Primary culture": {
          "@value": null,
        },
        "Sample Provider": {
          "@value": null,
        },
        "Other species": {
          "@value": null,
        },
        Sex: {
          "@value": null,
        },
        "Development stage": {
          "@value": null,
        },
        "Sample origin": {
        },
        Celltype: {
        },
        "Treatment specify": {
          "@value": null,
        },
        "Cell Line Name": {
          "@value": null,
        },
        "Tumor subtype": {
        },
        Treatement: {
          "@value": null,
        },
        "Patient clinical data available": {
          "@value": null,
        },
        "Patient survival data available": {
          "@value": null,
        },
        "Sample name": {
          "@value": null,
        },
        "Sample preservation": {
          "@value": null,
        },
        "DNA concentration measure technology": {
          "@value": null,
        },
        Notes: {
          "@value": null,
        },
        Species: {
          "@value": null,
        },
        "Age value": {
          "@type": "xsd:decimal",
        },
        "Age unit": {
          "@value": null,
        },
      },
      {
        "@context": {
          Tumor: "https://schema.metadatacenter.org/properties/08afe47d-d9fc-4290-aff3-d2fcb3873f92",
          Control: "https://schema.metadatacenter.org/properties/4767ed7e-d048-4941-8e4e-8d945729a243",
          Disease: "https://schema.metadatacenter.org/properties/51bcb11f-e124-45fc-bcca-82899f4d68f3",
          "Primary culture": "https://schema.metadatacenter.org/properties/5454767d-c051-4108-9930-3ff3955918f8",
          "Sample Provider": "https://schema.metadatacenter.org/properties/88647f3a-d381-4f6c-bb42-ad82ed669760",
          "Other species": "https://schema.metadatacenter.org/properties/70cc6996-0a8f-44c6-9d49-f935d221cd00",
          Sex: "https://schema.metadatacenter.org/properties/9da9f3d4-8067-4e70-a3f0-191bcf472101",
          "Development stage": "https://schema.metadatacenter.org/properties/7291a2b8-46b5-40d2-b133-3c390eee524d",
          "Sample origin": "https://schema.metadatacenter.org/properties/47a9e48a-489a-473b-a08a-211ca95cc71a",
          Celltype: "https://schema.metadatacenter.org/properties/6d2cd38e-5154-49d7-8c5d-b392cc2399a1",
          "Treatment specify": "https://schema.metadatacenter.org/properties/4325e81c-52eb-4a5b-b976-f2ff76ebf8e0",
          "Cell Line Name": "https://schema.metadatacenter.org/properties/5dc4dbdf-888d-444f-b81f-e2376bb4f256",
          "Tumor subtype": "https://schema.metadatacenter.org/properties/11e5c598-dfa1-4683-a46b-0d729f9c6d50",
          Treatement: "https://schema.metadatacenter.org/properties/e1979247-df90-45f3-a69d-253d14c12500",
          "Patient clinical data available": "https://schema.metadatacenter.org/properties/d5d85810-861d-4796-bcf6-be601cb8a054",
          "Patient survival data available": "https://schema.metadatacenter.org/properties/bc6ea875-b1fc-4a57-ac3e-dab0158b22c7",
          "Sample name": "https://schema.metadatacenter.org/properties/21be2752-1b07-48cb-8e57-3bcdf2b38071",
          "Sample preservation": "https://schema.metadatacenter.org/properties/6c9337ac-bde5-4822-a6b5-f16da380f53d",
          "DNA concentration measure technology": "https://schema.metadatacenter.org/properties/13744bf3-a684-4da7-be49-d6f9e1850c3a",
          Notes: "https://schema.metadatacenter.org/properties/23f5d351-7f22-45f3-883a-38f62c7d4b47",
          Species: "https://schema.metadatacenter.org/properties/d2e521c3-4a09-4837-a023-bb2f161a0afa",
          "Age value": "https://schema.metadatacenter.org/properties/4e4900c7-a23a-4f90-b8d9-f25d9262dcb6",
          "Age unit": "https://schema.metadatacenter.org/properties/e933f973-7fcb-4c87-bbdd-71ba96c93abd",
        },
        Tumor: {
          "@value": null,
        },
        Control: {
          "@value": null,
        },
        Disease: {
        },
        "Primary culture": {
          "@value": null,
        },
        "Sample Provider": {
          "@value": null,
        },
        "Other species": {
          "@value": null,
        },
        Sex: {
          "@value": null,
        },
        "Development stage": {
          "@value": null,
        },
        "Sample origin": {
        },
        Celltype: {
        },
        "Treatment specify": {
          "@value": null,
        },
        "Cell Line Name": {
          "@value": null,
        },
        "Tumor subtype": {
        },
        Treatement: {
          "@value": null,
        },
        "Patient clinical data available": {
          "@value": null,
        },
        "Patient survival data available": {
          "@value": null,
        },
        "Sample name": {
          "@value": null,
        },
        "Sample preservation": {
          "@value": null,
        },
        "DNA concentration measure technology": {
          "@value": null,
        },
        Notes: {
          "@value": null,
        },
        Species: {
          "@value": null,
        },
        "Age value": {
          "@type": "xsd:decimal",
        },
        "Age unit": {
          "@value": null,
        },
      },
      {
        "@context": {
          Tumor: "https://schema.metadatacenter.org/properties/08afe47d-d9fc-4290-aff3-d2fcb3873f92",
          Control: "https://schema.metadatacenter.org/properties/4767ed7e-d048-4941-8e4e-8d945729a243",
          Disease: "https://schema.metadatacenter.org/properties/51bcb11f-e124-45fc-bcca-82899f4d68f3",
          "Primary culture": "https://schema.metadatacenter.org/properties/5454767d-c051-4108-9930-3ff3955918f8",
          "Sample Provider": "https://schema.metadatacenter.org/properties/88647f3a-d381-4f6c-bb42-ad82ed669760",
          "Other species": "https://schema.metadatacenter.org/properties/70cc6996-0a8f-44c6-9d49-f935d221cd00",
          Sex: "https://schema.metadatacenter.org/properties/9da9f3d4-8067-4e70-a3f0-191bcf472101",
          "Development stage": "https://schema.metadatacenter.org/properties/7291a2b8-46b5-40d2-b133-3c390eee524d",
          "Sample origin": "https://schema.metadatacenter.org/properties/47a9e48a-489a-473b-a08a-211ca95cc71a",
          Celltype: "https://schema.metadatacenter.org/properties/6d2cd38e-5154-49d7-8c5d-b392cc2399a1",
          "Treatment specify": "https://schema.metadatacenter.org/properties/4325e81c-52eb-4a5b-b976-f2ff76ebf8e0",
          "Cell Line Name": "https://schema.metadatacenter.org/properties/5dc4dbdf-888d-444f-b81f-e2376bb4f256",
          "Tumor subtype": "https://schema.metadatacenter.org/properties/11e5c598-dfa1-4683-a46b-0d729f9c6d50",
          Treatement: "https://schema.metadatacenter.org/properties/e1979247-df90-45f3-a69d-253d14c12500",
          "Patient clinical data available": "https://schema.metadatacenter.org/properties/d5d85810-861d-4796-bcf6-be601cb8a054",
          "Patient survival data available": "https://schema.metadatacenter.org/properties/bc6ea875-b1fc-4a57-ac3e-dab0158b22c7",
          "Sample name": "https://schema.metadatacenter.org/properties/21be2752-1b07-48cb-8e57-3bcdf2b38071",
          "Sample preservation": "https://schema.metadatacenter.org/properties/6c9337ac-bde5-4822-a6b5-f16da380f53d",
          "DNA concentration measure technology": "https://schema.metadatacenter.org/properties/13744bf3-a684-4da7-be49-d6f9e1850c3a",
          Notes: "https://schema.metadatacenter.org/properties/23f5d351-7f22-45f3-883a-38f62c7d4b47",
          Species: "https://schema.metadatacenter.org/properties/d2e521c3-4a09-4837-a023-bb2f161a0afa",
          "Age value": "https://schema.metadatacenter.org/properties/4e4900c7-a23a-4f90-b8d9-f25d9262dcb6",
          "Age unit": "https://schema.metadatacenter.org/properties/e933f973-7fcb-4c87-bbdd-71ba96c93abd",
        },
        Tumor: {
          "@value": null,
        },
        Control: {
          "@value": null,
        },
        Disease: {
        },
        "Primary culture": {
          "@value": null,
        },
        "Sample Provider": {
          "@value": null,
        },
        "Other species": {
          "@value": null,
        },
        Sex: {
          "@value": null,
        },
        "Development stage": {
          "@value": null,
        },
        "Sample origin": {
        },
        Celltype: {
        },
        "Treatment specify": {
          "@value": null,
        },
        "Cell Line Name": {
          "@value": null,
        },
        "Tumor subtype": {
        },
        Treatement: {
          "@value": null,
        },
        "Patient clinical data available": {
          "@value": null,
        },
        "Patient survival data available": {
          "@value": null,
        },
        "Sample name": {
          "@value": null,
        },
        "Sample preservation": {
          "@value": null,
        },
        "DNA concentration measure technology": {
          "@value": null,
        },
        Notes: {
          "@value": null,
        },
        Species: {
          "@value": null,
        },
        "Age value": {
          "@type": "xsd:decimal",
        },
        "Age unit": {
          "@value": null,
        },
      },
    ],
    IJC_PI_contact_info: {
      "@context": {
        Name: "https://schema.metadatacenter.org/properties/882d1bc2-e9ad-4d26-86d2-47dbd5c32fcf",
        Email: "https://schema.metadatacenter.org/properties/623bee44-e4f2-459a-85db-abd32a638e9f",
        "Principal_Investigator ORCID Text (10624734)": "https://schema.metadatacenter.org/properties/7469493b-5033-4c1d-a53a-cff9fe78a5a2",
        "IJC_institution-company": "https://schema.metadatacenter.org/properties/45c8aeac-6b90-4862-a27e-aeaf21df935e",
      },
      Name: {
        "@value": "pi name",
        $$hashKey: "object:286",
      },
      Email: {
        "@value": "pi@email.com",
        $$hashKey: "object:297",
      },
      "Principal_Investigator ORCID Text (10624734)": {
        "@value": "orcid",
        $$hashKey: "object:309",
      },
      "IJC_institution-company": {
        "@context": {
          "Country Name (3152016)": "https://schema.metadatacenter.org/properties/a39768dc-6e98-4681-b9a2-ae3090679b33",
          Name: "https://schema.metadatacenter.org/properties/d0398a63-37af-44bb-a1b6-ee37f7ddfc64",
          Address: "https://schema.metadatacenter.org/properties/ee59a0c3-50e4-436a-b543-c760f4fd3261",
        },
        "Country Name (3152016)": {
          $$hashKey: "object:380",
          "@id": "http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#C17152",
          "rdfs:label": "Spain",
          "skos:notation": "Spain",
        },
        Name: {
          "@value": "asdasd",
          $$hashKey: "object:328",
        },
        Address: {
          "@value": "address",
          $$hashKey: "object:367",
        },
        $$hashKey: "object:129",
      },
      $$hashKey: "object:50",
    },
  },
  template: {
    "@id": "https://repo.metadatacenter.org/templates/96760b8a-a1a3-47c3-add8-d087012b174e",
    "@type": "https://schema.metadatacenter.org/core/Template",
    "@context": {
      xsd: "http://www.w3.org/2001/XMLSchema#",
      pav: "http://purl.org/pav/",
      bibo: "http://purl.org/ontology/bibo/",
      oslc: "http://open-services.net/ns/core#",
      schema: "http://schema.org/",
      "schema:name": {
        "@type": "xsd:string",
      },
      "schema:description": {
        "@type": "xsd:string",
      },
      "pav:createdOn": {
        "@type": "xsd:dateTime",
      },
      "pav:createdBy": {
        "@type": "@id",
      },
      "pav:lastUpdatedOn": {
        "@type": "xsd:dateTime",
      },
      "oslc:modifiedBy": {
        "@type": "@id",
      },
    },
    type: "object",
    title: "Bio forms template schema",
    description: "Bio forms template schema generated by the CEDAR Template Editor 2.7.1",
    _ui: {
      order: [
        "Project Name",
        "Consortium",
        "IJC_PI_contact_info",
        "IJC_Collaborator_contact_info",
        "IJC_sample_metadata",
      ],
      propertyLabels: {
        IJC_Collaborator_contact_info: "Collaborator",
        "Project Name": "Project Name",
        Consortium: "Consortium",
        IJC_sample_metadata: "Samples",
        IJC_PI_contact_info: "Principal_Investigator",
      },
      propertyDescriptions: {
        IJC_Collaborator_contact_info: "",
        "Project Name": "",
        Consortium: "If the Project is part of a Consortium, please specify",
        IJC_sample_metadata: "",
        IJC_PI_contact_info: "",
      },
    },
    properties: {
      "@context": {
        type: "object",
        properties: {
          rdfs: {
            type: "string",
            format: "uri",
            enum: [
              "http://www.w3.org/2000/01/rdf-schema#",
            ],
          },
          xsd: {
            type: "string",
            format: "uri",
            enum: [
              "http://www.w3.org/2001/XMLSchema#",
            ],
          },
          pav: {
            type: "string",
            format: "uri",
            enum: [
              "http://purl.org/pav/",
            ],
          },
          schema: {
            type: "string",
            format: "uri",
            enum: [
              "http://schema.org/",
            ],
          },
          oslc: {
            type: "string",
            format: "uri",
            enum: [
              "http://open-services.net/ns/core#",
            ],
          },
          skos: {
            type: "string",
            format: "uri",
            enum: [
              "http://www.w3.org/2004/02/skos/core#",
            ],
          },
          "rdfs:label": {
            type: "object",
            properties: {
              "@type": {
                type: "string",
                enum: [
                  "xsd:string",
                ],
              },
            },
          },
          "schema:isBasedOn": {
            type: "object",
            properties: {
              "@type": {
                type: "string",
                enum: [
                  "@id",
                ],
              },
            },
          },
          "schema:name": {
            type: "object",
            properties: {
              "@type": {
                type: "string",
                enum: [
                  "xsd:string",
                ],
              },
            },
          },
          "schema:description": {
            type: "object",
            properties: {
              "@type": {
                type: "string",
                enum: [
                  "xsd:string",
                ],
              },
            },
          },
          "pav:derivedFrom": {
            type: "object",
            properties: {
              "@type": {
                type: "string",
                enum: [
                  "@id",
                ],
              },
            },
          },
          "pav:createdOn": {
            type: "object",
            properties: {
              "@type": {
                type: "string",
                enum: [
                  "xsd:dateTime",
                ],
              },
            },
          },
          "pav:createdBy": {
            type: "object",
            properties: {
              "@type": {
                type: "string",
                enum: [
                  "@id",
                ],
              },
            },
          },
          "pav:lastUpdatedOn": {
            type: "object",
            properties: {
              "@type": {
                type: "string",
                enum: [
                  "xsd:dateTime",
                ],
              },
            },
          },
          "oslc:modifiedBy": {
            type: "object",
            properties: {
              "@type": {
                type: "string",
                enum: [
                  "@id",
                ],
              },
            },
          },
          "skos:notation": {
            type: "object",
            properties: {
              "@type": {
                type: "string",
                enum: [
                  "xsd:string",
                ],
              },
            },
          },
          IJC_Collaborator_contact_info: {
            enum: [
              "https://schema.metadatacenter.org/properties/786c72ac-6dea-446f-b005-5647a8578410",
            ],
          },
          "Project Name": {
            enum: [
              "https://schema.metadatacenter.org/properties/0eeb3fa2-33d0-4b2c-8e95-f13760fca85a",
            ],
          },
          Consortium: {
            enum: [
              "https://schema.metadatacenter.org/properties/7bd33b9b-9954-4a31-9205-3938dbeface4",
            ],
          },
          IJC_sample_metadata: {
            enum: [
              "https://schema.metadatacenter.org/properties/edb45673-3c98-42f4-8624-05332fe67e14",
            ],
          },
          IJC_PI_contact_info: {
            enum: [
              "https://schema.metadatacenter.org/properties/44ea3ec8-175f-46c4-80c2-b27e818ed9cf",
            ],
          },
        },
        required: [
          "xsd",
          "pav",
          "schema",
          "oslc",
          "schema:isBasedOn",
          "schema:name",
          "schema:description",
          "pav:createdOn",
          "pav:createdBy",
          "pav:lastUpdatedOn",
          "oslc:modifiedBy",
          "IJC_Collaborator_contact_info",
          "IJC_sample_metadata",
          "IJC_PI_contact_info",
        ],
        additionalProperties: false,
      },
      "@id": {
        type: [
          "string",
          "null",
        ],
        format: "uri",
      },
      "@type": {
        oneOf: [
          {
            type: "string",
            format: "uri",
          },
          {
            type: "array",
            minItems: 1,
            items: {
              type: "string",
              format: "uri",
            },
            uniqueItems: true,
          },
        ],
      },
      "schema:isBasedOn": {
        type: "string",
        format: "uri",
      },
      "schema:name": {
        type: "string",
        minLength: 1,
      },
      "schema:description": {
        type: "string",
      },
      "pav:derivedFrom": {
        type: "string",
        format: "uri",
      },
      "pav:createdOn": {
        type: [
          "string",
          "null",
        ],
        format: "date-time",
      },
      "pav:createdBy": {
        type: [
          "string",
          "null",
        ],
        format: "uri",
      },
      "pav:lastUpdatedOn": {
        type: [
          "string",
          "null",
        ],
        format: "date-time",
      },
      "oslc:modifiedBy": {
        type: [
          "string",
          "null",
        ],
        format: "uri",
      },
      IJC_Collaborator_contact_info: {
        "@id": "https://repo.metadatacenter.org/template-elements/5a3f4eab-9390-467c-9bf1-9bb1dabe81be",
        "@type": "https://schema.metadatacenter.org/core/TemplateElement",
        "@context": {
          xsd: "http://www.w3.org/2001/XMLSchema#",
          pav: "http://purl.org/pav/",
          bibo: "http://purl.org/ontology/bibo/",
          oslc: "http://open-services.net/ns/core#",
          schema: "http://schema.org/",
          "schema:name": {
            "@type": "xsd:string",
          },
          "schema:description": {
            "@type": "xsd:string",
          },
          "pav:createdOn": {
            "@type": "xsd:dateTime",
          },
          "pav:createdBy": {
            "@type": "@id",
          },
          "pav:lastUpdatedOn": {
            "@type": "xsd:dateTime",
          },
          "oslc:modifiedBy": {
            "@type": "@id",
          },
        },
        type: "object",
        title: "Ijc_contact_info element schema",
        description: "Ijc_contact_info element schema generated by the CEDAR Template Editor 2.7.1",
        _ui: {
          order: [
            "Name",
            "Email",
            "Principal_Investigator ORCID Text (10624734)",
            "IJC_institution-company",
          ],
          propertyLabels: {
            Name: "Name",
            Email: "Email",
            "Principal_Investigator ORCID Text (10624734)": "Principal_Investigator ORCID Text (10624734)",
            "IJC_institution-company": "Institution / Company",
          },
          propertyDescriptions: {
            Name: "",
            "Email address Contact": "",
            Email: "",
            ORCID: "",
            ORCID1: "",
            "Principal_Investigator ORCID Text (10624734)": "A persistent unique digital identifier assigned to a principal investigator by the Open Researcher and Contributor ID (ORCID) organization.",
            "IJC_institution-company": "",
          },
        },
        properties: {
          "@context": {
            type: "object",
            properties: {
              Name: {
                enum: [
                  "https://schema.metadatacenter.org/properties/882d1bc2-e9ad-4d26-86d2-47dbd5c32fcf",
                ],
              },
              Email: {
                enum: [
                  "https://schema.metadatacenter.org/properties/623bee44-e4f2-459a-85db-abd32a638e9f",
                ],
              },
              "Principal_Investigator ORCID Text (10624734)": {
                enum: [
                  "https://schema.metadatacenter.org/properties/7469493b-5033-4c1d-a53a-cff9fe78a5a2",
                ],
              },
              "IJC_institution-company": {
                enum: [
                  "https://schema.metadatacenter.org/properties/45c8aeac-6b90-4862-a27e-aeaf21df935e",
                ],
              },
            },
            additionalProperties: false,
            required: [
              "Name",
              "Email",
              "Principal_Investigator ORCID Text (10624734)",
              "IJC_institution-company",
            ],
          },
          "@id": {
            type: "string",
            format: "uri",
          },
          "@type": {
            oneOf: [
              {
                type: "string",
                format: "uri",
              },
              {
                type: "array",
                minItems: 1,
                items: {
                  type: "string",
                  format: "uri",
                },
                uniqueItems: true,
              },
            ],
          },
          Name: {
            "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
            "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
            "pav:createdOn": "2024-11-08T02:37:08-08:00",
            "pav:lastUpdatedOn": "2024-11-08T02:37:08-08:00",
            "@type": "https://schema.metadatacenter.org/core/TemplateField",
            "@id": "https://repo.metadatacenter.org/template-fields/868e28c2-5a62-4d48-879b-1b8ad3f2ed6d",
            type: "object",
            title: "Name field schema",
            description: "Name field schema generated by the CEDAR Artifact Library",
            "schema:name": "Name",
            "schema:description": "",
            "schema:schemaVersion": "1.6.0",
            "schema:identifier": "71_Wa_cj2ig",
            "pav:version": "1.0.0",
            "bibo:status": "bibo:published",
            "@context": {
              schema: "http://schema.org/",
              pav: "http://purl.org/pav/",
              xsd: "http://www.w3.org/2001/XMLSchema#",
              skos: "http://www.w3.org/2004/02/skos/core#",
              bibo: "http://purl.org/ontology/bibo/",
              oslc: "http://open-services.net/ns/core#",
              "schema:name": {
                "@type": "xsd:string",
              },
              "schema:description": {
                "@type": "xsd:string",
              },
              "pav:createdOn": {
                "@type": "xsd:dateTime",
              },
              "pav:createdBy": {
                "@type": "@id",
              },
              "pav:lastUpdatedOn": {
                "@type": "xsd:dateTime",
              },
              "oslc:modifiedBy": {
                "@type": "@id",
              },
              "skos:prefLabel": {
                "@type": "xsd:string",
              },
              "skos:altLabel": {
                "@type": "xsd:string",
              },
            },
            properties: {
              "@type": {
                oneOf: [
                  {
                    type: "string",
                    format: "uri",
                  },
                  {
                    type: "array",
                    minItems: 1,
                    items: {
                      type: "string",
                      format: "uri",
                    },
                    uniqueItems: true,
                  },
                ],
              },
              "rdfs:label": {
                type: [
                  "string",
                  "null",
                ],
              },
              "@value": {
                type: [
                  "string",
                  "null",
                ],
              },
            },
            additionalProperties: false,
            _valueConstraints: {
              literals: [
              ],
              requiredValue: false,
              multipleChoice: false,
            },
            "skos:prefLabel": "Name",
            "skos:altLabel": [
              "Name",
            ],
            _ui: {
              inputType: "textfield",
            },
            $schema: "http://json-schema.org/draft-04/schema#",
            _path: "IJC_Collaborator_contact_info.Name",
            _tmp: {
              nested: true,
            },
          },
          Email: {
            "@type": "https://schema.metadatacenter.org/core/TemplateField",
            "@context": {
              xsd: "http://www.w3.org/2001/XMLSchema#",
              pav: "http://purl.org/pav/",
              bibo: "http://purl.org/ontology/bibo/",
              oslc: "http://open-services.net/ns/core#",
              schema: "http://schema.org/",
              skos: "http://www.w3.org/2004/02/skos/core#",
              "schema:name": {
                "@type": "xsd:string",
              },
              "schema:description": {
                "@type": "xsd:string",
              },
              "skos:prefLabel": {
                "@type": "xsd:string",
              },
              "skos:altLabel": {
                "@type": "xsd:string",
              },
              "pav:createdOn": {
                "@type": "xsd:dateTime",
              },
              "pav:createdBy": {
                "@type": "@id",
              },
              "pav:lastUpdatedOn": {
                "@type": "xsd:dateTime",
              },
              "oslc:modifiedBy": {
                "@type": "@id",
              },
            },
            type: "object",
            title: "Email field schema",
            description: "Email field schema generated by the CEDAR Template Editor 2.6.62",
            _ui: {
              inputType: "email",
            },
            _valueConstraints: {
              requiredValue: false,
            },
            properties: {
              "@type": {
                oneOf: [
                  {
                    type: "string",
                    format: "uri",
                  },
                  {
                    type: "array",
                    minItems: 1,
                    items: {
                      type: "string",
                      format: "uri",
                    },
                    uniqueItems: true,
                  },
                ],
              },
              "@value": {
                type: [
                  "string",
                  "null",
                ],
              },
              "rdfs:label": {
                type: [
                  "string",
                  "null",
                ],
              },
            },
            required: [
              "@value",
            ],
            "schema:name": "Email",
            "schema:description": "",
            "pav:createdOn": "2024-11-08T02:37:08-08:00",
            "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
            "pav:lastUpdatedOn": "2024-11-08T02:37:08-08:00",
            "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
            "schema:schemaVersion": "1.6.0",
            additionalProperties: false,
            "skos:prefLabel": "Email",
            "@id": "https://repo.metadatacenter.org/template-fields/85ea1946-39ea-4905-85ee-2b28658033ac",
            $schema: "http://json-schema.org/draft-04/schema#",
            _path: "IJC_Collaborator_contact_info.Email",
            _tmp: {
              nested: true,
            },
          },
          "Principal_Investigator ORCID Text (10624734)": {
            "bibo:status": "bibo:published",
            "pav:version": "1.0.0",
            "@type": "https://schema.metadatacenter.org/core/TemplateField",
            "pav:createdOn": "2024-11-08T02:37:08-08:00",
            description: "'Principal_Investigator ORCID Text' field schema generated by the CEDAR Template Editor",
            type: "object",
            title: "'Principal_Investigator ORCID Text' field schema",
            "schema:schemaVersion": "1.6.0",
            "@context": {
              schema: "http://schema.org/",
              pav: "http://purl.org/pav/",
              xsd: "http://www.w3.org/2001/XMLSchema#",
              "pav:createdOn": {
                "@type": "xsd:dateTime",
              },
              skos: "http://www.w3.org/2004/02/skos/core#",
              oslc: "http://open-services.net/ns/core#",
              "skos:altLabel": {
                "@type": "xsd:string",
              },
              "pav:createdBy": {
                "@type": "@id",
              },
              "skos:prefLabel": {
                "@type": "xsd:string",
              },
              "schema:description": {
                "@type": "xsd:string",
              },
              "oslc:modifiedBy": {
                "@type": "@id",
              },
              "pav:lastUpdatedOn": {
                "@type": "xsd:dateTime",
              },
              bibo: "http://purl.org/ontology/bibo/",
              "schema:name": {
                "@type": "xsd:string",
              },
            },
            required: [
              "@value",
            ],
            "schema:identifier": "10624734",
            "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
            "skos:prefLabel": "ORCID",
            _ui: {
              inputType: "textfield",
            },
            _valueConstraints: {
              multipleChoice: false,
              maxLength: 255,
              requiredValue: false,
            },
            "schema:description": "A persistent unique digital identifier assigned to a principal investigator by the Open Researcher and Contributor ID (ORCID) organization.",
            "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
            "pav:lastUpdatedOn": "2024-11-08T02:37:08-08:00",
            "@id": "https://repo.metadatacenter.org/template-fields/86274eaa-cb94-4c68-b5f3-5f4d036a419a",
            additionalProperties: false,
            "schema:name": "Principal_Investigator ORCID Text (10624734)",
            properties: {
              "@type": {
                oneOf: [
                  {
                    format: "uri",
                    type: "string",
                  },
                  {
                    minItems: 1,
                    uniqueItems: true,
                    type: "array",
                    items: {
                      format: "uri",
                      type: "string",
                    },
                  },
                ],
              },
              "@value": {
                type: [
                  "string",
                  "null",
                ],
              },
            },
            $schema: "http://json-schema.org/draft-04/schema#",
            _path: "IJC_Collaborator_contact_info.Principal_Investigator ORCID Text (10624734)",
            _tmp: {
              nested: true,
            },
          },
          "IJC_institution-company": {
            "@id": "https://repo.metadatacenter.org/template-elements/914ece68-45aa-47d0-aa0b-f375ae56fa33",
            "@type": "https://schema.metadatacenter.org/core/TemplateElement",
            "@context": {
              xsd: "http://www.w3.org/2001/XMLSchema#",
              pav: "http://purl.org/pav/",
              bibo: "http://purl.org/ontology/bibo/",
              oslc: "http://open-services.net/ns/core#",
              schema: "http://schema.org/",
              "schema:name": {
                "@type": "xsd:string",
              },
              "schema:description": {
                "@type": "xsd:string",
              },
              "pav:createdOn": {
                "@type": "xsd:dateTime",
              },
              "pav:createdBy": {
                "@type": "@id",
              },
              "pav:lastUpdatedOn": {
                "@type": "xsd:dateTime",
              },
              "oslc:modifiedBy": {
                "@type": "@id",
              },
            },
            type: "object",
            title: "Ijc_institution-company element schema",
            description: "Ijc_institution-company element schema generated by the CEDAR Template Editor 2.6.62",
            _ui: {
              order: [
                "Name",
                "Address",
                "Country Name (3152016)",
              ],
              propertyLabels: {
                "Country Name (3152016)": "Country Name (3152016)",
                Name: "Name",
                Address: "Address",
              },
              propertyDescriptions: {
                "Country Name (3152016)": "Text name for a \"Country\", referring to a wide variety of dependencies, areas of special sovereignty, uninhabited islands, and other entities in addition to the traditional countries or independent states. (from CIA World Factbook 2002: http://www.cia.gov/cia/publications/factbook/docs/notesanddefs.html).",
                Name: "",
                Address: "",
              },
            },
            properties: {
              "@context": {
                type: "object",
                properties: {
                  "Country Name (3152016)": {
                    enum: [
                      "https://schema.metadatacenter.org/properties/a39768dc-6e98-4681-b9a2-ae3090679b33",
                    ],
                  },
                  Name: {
                    enum: [
                      "https://schema.metadatacenter.org/properties/d0398a63-37af-44bb-a1b6-ee37f7ddfc64",
                    ],
                  },
                  Address: {
                    enum: [
                      "https://schema.metadatacenter.org/properties/ee59a0c3-50e4-436a-b543-c760f4fd3261",
                    ],
                  },
                },
                additionalProperties: false,
                required: [
                  "Name",
                  "Address",
                  "Country Name (3152016)",
                ],
              },
              "@id": {
                type: "string",
                format: "uri",
              },
              "@type": {
                oneOf: [
                  {
                    type: "string",
                    format: "uri",
                  },
                  {
                    type: "array",
                    minItems: 1,
                    items: {
                      type: "string",
                      format: "uri",
                    },
                    uniqueItems: true,
                  },
                ],
              },
              "Country Name (3152016)": {
                "bibo:status": "bibo:published",
                "pav:version": "1.0.0",
                "@type": "https://schema.metadatacenter.org/core/TemplateField",
                "pav:createdOn": "2024-09-13T06:53:38-07:00",
                description: "The 'Country Name' field schema auto-generated by the CEDAR/CDE Tool",
                type: "object",
                title: "The 'Country Name' field schema",
                "schema:schemaVersion": "1.6.0",
                "@context": {
                  schema: "http://schema.org/",
                  pav: "http://purl.org/pav/",
                  xsd: "http://www.w3.org/2001/XMLSchema#",
                  "pav:createdOn": {
                    "@type": "xsd:dateTime",
                  },
                  skos: "http://www.w3.org/2004/02/skos/core#",
                  oslc: "http://open-services.net/ns/core#",
                  "skos:altLabel": {
                    "@type": "xsd:string",
                  },
                  "pav:createdBy": {
                    "@type": "@id",
                  },
                  "skos:prefLabel": {
                    "@type": "xsd:string",
                  },
                  "schema:description": {
                    "@type": "xsd:string",
                  },
                  "oslc:modifiedBy": {
                    "@type": "@id",
                  },
                  "pav:lastUpdatedOn": {
                    "@type": "xsd:dateTime",
                  },
                  bibo: "http://purl.org/ontology/bibo/",
                  "schema:name": {
                    "@type": "xsd:string",
                  },
                },
                "schema:identifier": "3152016",
                "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
                "skos:prefLabel": "Country",
                _ui: {
                  inputType: "textfield",
                },
                _valueConstraints: {
                  classes: [
                  ],
                  valueSets: [
                    {
                      name: "Country Name",
                      numTerms: 270,
                      vsCollection: "CADSR-VS",
                      uri: "https://cadsr.nci.nih.gov/metadata/CADSR-VS/VD3151957v1",
                    },
                  ],
                  multipleChoice: false,
                  branches: [
                  ],
                  maxLength: 40,
                  ontologies: [
                  ],
                  requiredValue: false,
                },
                "schema:description": "Text name for a \"Country\", referring to a wide variety of dependencies, areas of special sovereignty, uninhabited islands, and other entities in addition to the traditional countries or independent states. (from CIA World Factbook 2002: http://www.cia.gov/cia/publications/factbook/docs/notesanddefs.html).",
                "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
                "pav:lastUpdatedOn": "2024-09-13T06:53:38-07:00",
                "@id": "https://repo.metadatacenter.org/template-fields/80467df6-0183-48c4-820d-097995df0862",
                additionalProperties: false,
                "schema:name": "Country Name (3152016)",
                properties: {
                  "skos:notation": {
                    type: [
                      "string",
                      "null",
                    ],
                  },
                  "@id": {
                    format: "uri",
                    type: "string",
                  },
                  "rdfs:label": {
                    type: [
                      "string",
                      "null",
                    ],
                  },
                  "@type": {
                    oneOf: [
                      {
                        format: "uri",
                        type: "string",
                      },
                      {
                        minItems: 1,
                        uniqueItems: true,
                        type: "array",
                        items: {
                          format: "uri",
                          type: "string",
                        },
                      },
                    ],
                  },
                },
                $schema: "http://json-schema.org/draft-04/schema#",
                _path: "IJC_Collaborator_contact_info.IJC_institution-company.Country Name (3152016)",
                _tmp: {
                  nested: true,
                },
              },
              Name: {
                "@type": "https://schema.metadatacenter.org/core/TemplateField",
                "@context": {
                  xsd: "http://www.w3.org/2001/XMLSchema#",
                  pav: "http://purl.org/pav/",
                  bibo: "http://purl.org/ontology/bibo/",
                  oslc: "http://open-services.net/ns/core#",
                  schema: "http://schema.org/",
                  skos: "http://www.w3.org/2004/02/skos/core#",
                  "schema:name": {
                    "@type": "xsd:string",
                  },
                  "schema:description": {
                    "@type": "xsd:string",
                  },
                  "skos:prefLabel": {
                    "@type": "xsd:string",
                  },
                  "skos:altLabel": {
                    "@type": "xsd:string",
                  },
                  "pav:createdOn": {
                    "@type": "xsd:dateTime",
                  },
                  "pav:createdBy": {
                    "@type": "@id",
                  },
                  "pav:lastUpdatedOn": {
                    "@type": "xsd:dateTime",
                  },
                  "oslc:modifiedBy": {
                    "@type": "@id",
                  },
                },
                type: "object",
                title: "Name field schema",
                description: "Name field schema generated by the CEDAR Template Editor 2.6.62",
                _ui: {
                  inputType: "textfield",
                },
                _valueConstraints: {
                  requiredValue: false,
                },
                properties: {
                  "@type": {
                    oneOf: [
                      {
                        type: "string",
                        format: "uri",
                      },
                      {
                        type: "array",
                        minItems: 1,
                        items: {
                          type: "string",
                          format: "uri",
                        },
                        uniqueItems: true,
                      },
                    ],
                  },
                  "@value": {
                    type: [
                      "string",
                      "null",
                    ],
                  },
                  "rdfs:label": {
                    type: [
                      "string",
                      "null",
                    ],
                  },
                },
                required: [
                  "@value",
                ],
                "schema:name": "Name",
                "schema:description": "",
                "pav:createdOn": "2024-09-13T06:53:38-07:00",
                "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
                "pav:lastUpdatedOn": "2024-09-13T06:53:38-07:00",
                "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
                "schema:schemaVersion": "1.6.0",
                additionalProperties: false,
                "skos:prefLabel": "Name",
                "@id": "https://repo.metadatacenter.org/template-fields/c4045675-178d-4dc2-b5ba-5c2c3b49a0c4",
                $schema: "http://json-schema.org/draft-04/schema#",
                _path: "IJC_Collaborator_contact_info.IJC_institution-company.Name",
                _tmp: {
                  nested: true,
                },
              },
              Address: {
                "@type": "https://schema.metadatacenter.org/core/TemplateField",
                "@context": {
                  xsd: "http://www.w3.org/2001/XMLSchema#",
                  pav: "http://purl.org/pav/",
                  bibo: "http://purl.org/ontology/bibo/",
                  oslc: "http://open-services.net/ns/core#",
                  schema: "http://schema.org/",
                  skos: "http://www.w3.org/2004/02/skos/core#",
                  "schema:name": {
                    "@type": "xsd:string",
                  },
                  "schema:description": {
                    "@type": "xsd:string",
                  },
                  "skos:prefLabel": {
                    "@type": "xsd:string",
                  },
                  "skos:altLabel": {
                    "@type": "xsd:string",
                  },
                  "pav:createdOn": {
                    "@type": "xsd:dateTime",
                  },
                  "pav:createdBy": {
                    "@type": "@id",
                  },
                  "pav:lastUpdatedOn": {
                    "@type": "xsd:dateTime",
                  },
                  "oslc:modifiedBy": {
                    "@type": "@id",
                  },
                },
                type: "object",
                title: "Address field schema",
                description: "Address field schema generated by the CEDAR Template Editor 2.6.62",
                _ui: {
                  inputType: "textfield",
                },
                _valueConstraints: {
                  requiredValue: false,
                },
                properties: {
                  "@type": {
                    oneOf: [
                      {
                        type: "string",
                        format: "uri",
                      },
                      {
                        type: "array",
                        minItems: 1,
                        items: {
                          type: "string",
                          format: "uri",
                        },
                        uniqueItems: true,
                      },
                    ],
                  },
                  "@value": {
                    type: [
                      "string",
                      "null",
                    ],
                  },
                  "rdfs:label": {
                    type: [
                      "string",
                      "null",
                    ],
                  },
                },
                required: [
                  "@value",
                ],
                "schema:name": "Address",
                "schema:description": "",
                "pav:createdOn": "2024-09-13T06:53:38-07:00",
                "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
                "pav:lastUpdatedOn": "2024-09-13T06:53:38-07:00",
                "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
                "schema:schemaVersion": "1.6.0",
                additionalProperties: false,
                "skos:prefLabel": "Address",
                "@id": "https://repo.metadatacenter.org/template-fields/9eb1175b-4ef6-470c-aff0-93ac7d52312c",
                $schema: "http://json-schema.org/draft-04/schema#",
                _path: "IJC_Collaborator_contact_info.IJC_institution-company.Address",
                _tmp: {
                  nested: true,
                },
              },
            },
            "schema:name": "IJC_institution-company",
            "schema:description": "",
            required: [
              "@context",
              "@id",
              "Name",
              "Address",
              "Country Name (3152016)",
            ],
            "pav:createdOn": "2024-11-08T02:37:08-08:00",
            "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
            "pav:lastUpdatedOn": "2024-11-08T02:37:08-08:00",
            "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
            "schema:schemaVersion": "1.6.0",
            additionalProperties: false,
            "pav:version": "0.0.1",
            "bibo:status": "bibo:draft",
            "skos:prefLabel": "Institution / Company",
            $schema: "http://json-schema.org/draft-04/schema#",
            _tmp: {
              nested: true,
            },
          },
        },
        "schema:name": "IJC_Collaborator_contact_info",
        "schema:description": "",
        required: [
          "@context",
          "@id",
          "Name",
          "Email",
          "Principal_Investigator ORCID Text (10624734)",
          "IJC_institution-company",
        ],
        "pav:createdOn": "2024-11-20T03:41:09-08:00",
        "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
        "pav:lastUpdatedOn": "2024-11-20T03:41:09-08:00",
        "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
        "schema:schemaVersion": "1.6.0",
        additionalProperties: false,
        "pav:version": "0.0.1",
        "bibo:status": "bibo:draft",
        $schema: "http://json-schema.org/draft-04/schema#",
      },
      "Project Name": {
        "@type": "https://schema.metadatacenter.org/core/TemplateField",
        "@context": {
          xsd: "http://www.w3.org/2001/XMLSchema#",
          pav: "http://purl.org/pav/",
          bibo: "http://purl.org/ontology/bibo/",
          oslc: "http://open-services.net/ns/core#",
          schema: "http://schema.org/",
          skos: "http://www.w3.org/2004/02/skos/core#",
          "schema:name": {
            "@type": "xsd:string",
          },
          "schema:description": {
            "@type": "xsd:string",
          },
          "skos:prefLabel": {
            "@type": "xsd:string",
          },
          "skos:altLabel": {
            "@type": "xsd:string",
          },
          "pav:createdOn": {
            "@type": "xsd:dateTime",
          },
          "pav:createdBy": {
            "@type": "@id",
          },
          "pav:lastUpdatedOn": {
            "@type": "xsd:dateTime",
          },
          "oslc:modifiedBy": {
            "@type": "@id",
          },
        },
        type: "object",
        title: "Project Name field schema",
        description: "Project Name field schema generated by the CEDAR Template Editor 2.6.62",
        _ui: {
          inputType: "textfield",
        },
        _valueConstraints: {
          requiredValue: true,
        },
        properties: {
          "@type": {
            oneOf: [
              {
                type: "string",
                format: "uri",
              },
              {
                type: "array",
                minItems: 1,
                items: {
                  type: "string",
                  format: "uri",
                },
                uniqueItems: true,
              },
            ],
          },
          "@value": {
            type: [
              "string",
              "null",
            ],
          },
          "rdfs:label": {
            type: [
              "string",
              "null",
            ],
          },
        },
        required: [
          "@value",
        ],
        "schema:name": "Project Name",
        "schema:description": "",
        "pav:createdOn": "2024-11-20T03:41:09-08:00",
        "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
        "pav:lastUpdatedOn": "2024-11-20T03:41:09-08:00",
        "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
        "schema:schemaVersion": "1.6.0",
        additionalProperties: false,
        "skos:prefLabel": "Project Name",
        "@id": "https://repo.metadatacenter.org/template-fields/f843eec4-a215-4661-a28e-c319b9db0c64",
        $schema: "http://json-schema.org/draft-04/schema#",
        _path: "Project Name",
      },
      Consortium: {
        "@type": "https://schema.metadatacenter.org/core/TemplateField",
        "@context": {
          xsd: "http://www.w3.org/2001/XMLSchema#",
          pav: "http://purl.org/pav/",
          bibo: "http://purl.org/ontology/bibo/",
          oslc: "http://open-services.net/ns/core#",
          schema: "http://schema.org/",
          skos: "http://www.w3.org/2004/02/skos/core#",
          "schema:name": {
            "@type": "xsd:string",
          },
          "schema:description": {
            "@type": "xsd:string",
          },
          "skos:prefLabel": {
            "@type": "xsd:string",
          },
          "skos:altLabel": {
            "@type": "xsd:string",
          },
          "pav:createdOn": {
            "@type": "xsd:dateTime",
          },
          "pav:createdBy": {
            "@type": "@id",
          },
          "pav:lastUpdatedOn": {
            "@type": "xsd:dateTime",
          },
          "oslc:modifiedBy": {
            "@type": "@id",
          },
        },
        type: "object",
        title: "Consortium field schema",
        description: "Consortium field schema generated by the CEDAR Template Editor 2.6.62",
        _ui: {
          inputType: "textfield",
        },
        _valueConstraints: {
          requiredValue: false,
        },
        properties: {
          "@type": {
            oneOf: [
              {
                type: "string",
                format: "uri",
              },
              {
                type: "array",
                minItems: 1,
                items: {
                  type: "string",
                  format: "uri",
                },
                uniqueItems: true,
              },
            ],
          },
          "@value": {
            type: [
              "string",
              "null",
            ],
          },
          "rdfs:label": {
            type: [
              "string",
              "null",
            ],
          },
        },
        required: [
          "@value",
        ],
        "schema:name": "Consortium",
        "schema:description": "If the Project is part of a Consortium, please specify",
        "pav:createdOn": "2024-11-20T03:41:09-08:00",
        "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
        "pav:lastUpdatedOn": "2024-11-20T03:41:09-08:00",
        "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
        "schema:schemaVersion": "1.6.0",
        additionalProperties: false,
        "skos:prefLabel": "Consortium",
        "@id": "https://repo.metadatacenter.org/template-fields/849a712c-d12d-47fc-aca9-19306619f6e6",
        $schema: "http://json-schema.org/draft-04/schema#",
        _path: "Consortium",
      },
      IJC_sample_metadata: {
        type: "array",
        "pav:derivedFrom": "https://repo.metadatacenter.org/template-elements/8001ce62-ffa1-4bba-84cb-5aabb20368fc",
        minItems: 1,
        items: {
          "@type": "https://schema.metadatacenter.org/core/TemplateElement",
          "@context": {
            xsd: "http://www.w3.org/2001/XMLSchema#",
            pav: "http://purl.org/pav/",
            bibo: "http://purl.org/ontology/bibo/",
            oslc: "http://open-services.net/ns/core#",
            schema: "http://schema.org/",
            "schema:name": {
              "@type": "xsd:string",
            },
            "schema:description": {
              "@type": "xsd:string",
            },
            "pav:createdOn": {
              "@type": "xsd:dateTime",
            },
            "pav:createdBy": {
              "@type": "@id",
            },
            "pav:lastUpdatedOn": {
              "@type": "xsd:dateTime",
            },
            "oslc:modifiedBy": {
              "@type": "@id",
            },
          },
          type: "object",
          title: "Samples element schema",
          description: "Samples element schema generated by the CEDAR Template Editor 2.7.1",
          _ui: {
            order: [
              "Sample name",
              "Sample Provider",
              "Cell Line Name",
              "Species",
              "Other species",
              "Sex",
              "Age value",
              "Age unit",
              "Development stage",
              "Sample origin",
              "Celltype",
              "Primary culture",
              "Disease",
              "Tumor",
              "Tumor subtype",
              "Control",
              "Treatement",
              "Treatment specify",
              "Patient clinical data available",
              "Patient survival data available",
              "Sample preservation",
              "DNA concentration measure technology",
              "Notes",
            ],
            propertyLabels: {
              Tumor: "Tumor",
              Control: "Control",
              Disease: "Disease",
              "Primary culture": "Primary culture",
              "Sample Provider": "Sample Provider",
              "Other species": "Other species",
              Sex: "Sex",
              "Development stage": "Development stage",
              "Sample origin": "Sample origin",
              Celltype: "Celltype",
              "Treatment specify": "Treatment specify",
              "Cell Line Name": "Cell Line Name",
              "Tumor subtype": "Tumor subtype",
              Treatement: "Treatement",
              "Patient clinical data available": "Patient clinical data available",
              "Patient survival data available": "Patient survival data available",
              "Sample name": "Sample name",
              "Sample preservation": "Sample preservation",
              "DNA concentration measure technology": "DNA concentration measure technology",
              Notes: "Notes",
              Species: "Species",
              "Age value": "Age value",
              "Age unit": "Age unit",
            },
            propertyDescriptions: {
              "730bc1d0-7d4c-4a0c-b26a-4c87126aa3ee": "",
              Age: "",
              Organ: "",
              Tumor: "",
              Control: "",
              Disease: "",
              Phenotype: "",
              "Sample Preservation Method": "",
              "Cell Line Name": "",
              "Cell Line Source": "",
              "Primary culture": "",
              "Sample Provider": "",
              Species: "",
              "Other species": "Fill in case you have selected \"Other\" as species",
              Sex: "",
              "Development stage": "",
              "Sample origin": "",
              Celltype: "",
              "Treatment specify": "",
              "Tumor subtype": "Morphological type",
              Treatemetn: "",
              Notes: "",
              Treatement: "",
              "Patient clinical data available": "",
              "Patient survival data available": "",
              Age1: "",
              Age2: "",
              "Sample name": "",
              "Sample preservation": "",
              "DNA concentration measure technology": "",
              "Age value": "",
              "Age unit": "",
            },
          },
          properties: {
            "@context": {
              type: "object",
              properties: {
                Tumor: {
                  enum: [
                    "https://schema.metadatacenter.org/properties/08afe47d-d9fc-4290-aff3-d2fcb3873f92",
                  ],
                },
                Control: {
                  enum: [
                    "https://schema.metadatacenter.org/properties/4767ed7e-d048-4941-8e4e-8d945729a243",
                  ],
                },
                Disease: {
                  enum: [
                    "https://schema.metadatacenter.org/properties/51bcb11f-e124-45fc-bcca-82899f4d68f3",
                  ],
                },
                "Primary culture": {
                  enum: [
                    "https://schema.metadatacenter.org/properties/5454767d-c051-4108-9930-3ff3955918f8",
                  ],
                },
                "Sample Provider": {
                  enum: [
                    "https://schema.metadatacenter.org/properties/88647f3a-d381-4f6c-bb42-ad82ed669760",
                  ],
                },
                "Other species": {
                  enum: [
                    "https://schema.metadatacenter.org/properties/70cc6996-0a8f-44c6-9d49-f935d221cd00",
                  ],
                },
                Sex: {
                  enum: [
                    "https://schema.metadatacenter.org/properties/9da9f3d4-8067-4e70-a3f0-191bcf472101",
                  ],
                },
                "Development stage": {
                  enum: [
                    "https://schema.metadatacenter.org/properties/7291a2b8-46b5-40d2-b133-3c390eee524d",
                  ],
                },
                "Sample origin": {
                  enum: [
                    "https://schema.metadatacenter.org/properties/47a9e48a-489a-473b-a08a-211ca95cc71a",
                  ],
                },
                Celltype: {
                  enum: [
                    "https://schema.metadatacenter.org/properties/6d2cd38e-5154-49d7-8c5d-b392cc2399a1",
                  ],
                },
                "Treatment specify": {
                  enum: [
                    "https://schema.metadatacenter.org/properties/4325e81c-52eb-4a5b-b976-f2ff76ebf8e0",
                  ],
                },
                "Cell Line Name": {
                  enum: [
                    "https://schema.metadatacenter.org/properties/5dc4dbdf-888d-444f-b81f-e2376bb4f256",
                  ],
                },
                "Tumor subtype": {
                  enum: [
                    "https://schema.metadatacenter.org/properties/11e5c598-dfa1-4683-a46b-0d729f9c6d50",
                  ],
                },
                Treatement: {
                  enum: [
                    "https://schema.metadatacenter.org/properties/e1979247-df90-45f3-a69d-253d14c12500",
                  ],
                },
                "Patient clinical data available": {
                  enum: [
                    "https://schema.metadatacenter.org/properties/d5d85810-861d-4796-bcf6-be601cb8a054",
                  ],
                },
                "Patient survival data available": {
                  enum: [
                    "https://schema.metadatacenter.org/properties/bc6ea875-b1fc-4a57-ac3e-dab0158b22c7",
                  ],
                },
                "Sample name": {
                  enum: [
                    "https://schema.metadatacenter.org/properties/21be2752-1b07-48cb-8e57-3bcdf2b38071",
                  ],
                },
                "Sample preservation": {
                  enum: [
                    "https://schema.metadatacenter.org/properties/6c9337ac-bde5-4822-a6b5-f16da380f53d",
                  ],
                },
                "DNA concentration measure technology": {
                  enum: [
                    "https://schema.metadatacenter.org/properties/13744bf3-a684-4da7-be49-d6f9e1850c3a",
                  ],
                },
                Notes: {
                  enum: [
                    "https://schema.metadatacenter.org/properties/23f5d351-7f22-45f3-883a-38f62c7d4b47",
                  ],
                },
                Species: {
                  enum: [
                    "https://schema.metadatacenter.org/properties/d2e521c3-4a09-4837-a023-bb2f161a0afa",
                  ],
                },
                "Age value": {
                  enum: [
                    "https://schema.metadatacenter.org/properties/4e4900c7-a23a-4f90-b8d9-f25d9262dcb6",
                  ],
                },
                "Age unit": {
                  enum: [
                    "https://schema.metadatacenter.org/properties/e933f973-7fcb-4c87-bbdd-71ba96c93abd",
                  ],
                },
              },
              additionalProperties: false,
              required: [
                "Sample name",
                "Sample Provider",
                "Sex",
                "Sample origin",
                "Celltype",
                "Tumor",
                "Control",
                "Disease",
                "Treatment specify",
                "Primary culture",
                "Cell Line Name",
                "Other species",
                "Development stage",
                "Tumor subtype",
                "Treatement",
                "Patient clinical data available",
                "Patient survival data available",
                "Sample preservation",
                "DNA concentration measure technology",
                "Notes",
                "Species",
                "Age value",
                "Age unit",
              ],
            },
            "@id": {
              type: "string",
              format: "uri",
            },
            "@type": {
              oneOf: [
                {
                  type: "string",
                  format: "uri",
                },
                {
                  type: "array",
                  minItems: 1,
                  items: {
                    type: "string",
                    format: "uri",
                  },
                  uniqueItems: true,
                },
              ],
            },
            Tumor: {
              "@type": "https://schema.metadatacenter.org/core/TemplateField",
              "@context": {
                xsd: "http://www.w3.org/2001/XMLSchema#",
                pav: "http://purl.org/pav/",
                bibo: "http://purl.org/ontology/bibo/",
                oslc: "http://open-services.net/ns/core#",
                schema: "http://schema.org/",
                skos: "http://www.w3.org/2004/02/skos/core#",
                "schema:name": {
                  "@type": "xsd:string",
                },
                "schema:description": {
                  "@type": "xsd:string",
                },
                "skos:prefLabel": {
                  "@type": "xsd:string",
                },
                "skos:altLabel": {
                  "@type": "xsd:string",
                },
                "pav:createdOn": {
                  "@type": "xsd:dateTime",
                },
                "pav:createdBy": {
                  "@type": "@id",
                },
                "pav:lastUpdatedOn": {
                  "@type": "xsd:dateTime",
                },
                "oslc:modifiedBy": {
                  "@type": "@id",
                },
              },
              type: "object",
              title: "Tumor field schema",
              description: "Tumor field schema generated by the CEDAR Template Editor 2.6.62",
              _ui: {
                inputType: "list",
              },
              _valueConstraints: {
                requiredValue: true,
                multipleChoice: false,
                literals: [
                  {
                    label: "Primary",
                  },
                  {
                    label: "Metastasis",
                  },
                  {
                    label: "Unknown",
                  },
                  {
                    label: "No tumor",
                  },
                ],
              },
              properties: {
                "@type": {
                  oneOf: [
                    {
                      type: "string",
                      format: "uri",
                    },
                    {
                      type: "array",
                      minItems: 1,
                      items: {
                        type: "string",
                        format: "uri",
                      },
                      uniqueItems: true,
                    },
                  ],
                },
                "@value": {
                  type: [
                    "string",
                    "null",
                  ],
                },
                "rdfs:label": {
                  type: [
                    "string",
                    "null",
                  ],
                },
              },
              required: [
                "@value",
              ],
              "schema:name": "Tumor",
              "schema:description": "",
              "pav:createdOn": "2024-11-20T03:41:06-08:00",
              "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "pav:lastUpdatedOn": "2024-11-20T03:41:06-08:00",
              "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "schema:schemaVersion": "1.6.0",
              additionalProperties: false,
              "skos:prefLabel": "Tumor",
              "@id": "https://repo.metadatacenter.org/template-fields/770cb922-c29b-48eb-914a-85fb71bf2041",
              $schema: "http://json-schema.org/draft-04/schema#",
              _path: "IJC_sample_metadata.Tumor",
            },
            Control: {
              "@type": "https://schema.metadatacenter.org/core/TemplateField",
              "@context": {
                xsd: "http://www.w3.org/2001/XMLSchema#",
                pav: "http://purl.org/pav/",
                bibo: "http://purl.org/ontology/bibo/",
                oslc: "http://open-services.net/ns/core#",
                schema: "http://schema.org/",
                skos: "http://www.w3.org/2004/02/skos/core#",
                "schema:name": {
                  "@type": "xsd:string",
                },
                "schema:description": {
                  "@type": "xsd:string",
                },
                "skos:prefLabel": {
                  "@type": "xsd:string",
                },
                "skos:altLabel": {
                  "@type": "xsd:string",
                },
                "pav:createdOn": {
                  "@type": "xsd:dateTime",
                },
                "pav:createdBy": {
                  "@type": "@id",
                },
                "pav:lastUpdatedOn": {
                  "@type": "xsd:dateTime",
                },
                "oslc:modifiedBy": {
                  "@type": "@id",
                },
              },
              type: "object",
              title: "Control field schema",
              description: "Control field schema generated by the CEDAR Template Editor 2.6.62",
              _ui: {
                inputType: "radio",
              },
              _valueConstraints: {
                requiredValue: true,
                multipleChoice: false,
                literals: [
                  {
                    label: "Yes",
                  },
                  {
                    label: "No",
                  },
                ],
              },
              properties: {
                "@type": {
                  oneOf: [
                    {
                      type: "string",
                      format: "uri",
                    },
                    {
                      type: "array",
                      minItems: 1,
                      items: {
                        type: "string",
                        format: "uri",
                      },
                      uniqueItems: true,
                    },
                  ],
                },
                "@value": {
                  type: [
                    "string",
                    "null",
                  ],
                },
                "rdfs:label": {
                  type: [
                    "string",
                    "null",
                  ],
                },
              },
              required: [
                "@value",
              ],
              "schema:name": "Control",
              "schema:description": "",
              "pav:createdOn": "2024-11-20T03:41:06-08:00",
              "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "pav:lastUpdatedOn": "2024-11-20T03:41:06-08:00",
              "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "schema:schemaVersion": "1.6.0",
              additionalProperties: false,
              "skos:prefLabel": "Control",
              "@id": "https://repo.metadatacenter.org/template-fields/95dff0c6-fdc4-431c-8af4-433240087ca1",
              $schema: "http://json-schema.org/draft-04/schema#",
              _path: "IJC_sample_metadata.Control",
            },
            Disease: {
              "@type": "https://schema.metadatacenter.org/core/TemplateField",
              "@context": {
                xsd: "http://www.w3.org/2001/XMLSchema#",
                pav: "http://purl.org/pav/",
                bibo: "http://purl.org/ontology/bibo/",
                oslc: "http://open-services.net/ns/core#",
                schema: "http://schema.org/",
                skos: "http://www.w3.org/2004/02/skos/core#",
                "schema:name": {
                  "@type": "xsd:string",
                },
                "schema:description": {
                  "@type": "xsd:string",
                },
                "skos:prefLabel": {
                  "@type": "xsd:string",
                },
                "skos:altLabel": {
                  "@type": "xsd:string",
                },
                "pav:createdOn": {
                  "@type": "xsd:dateTime",
                },
                "pav:createdBy": {
                  "@type": "@id",
                },
                "pav:lastUpdatedOn": {
                  "@type": "xsd:dateTime",
                },
                "oslc:modifiedBy": {
                  "@type": "@id",
                },
              },
              type: "object",
              title: "Disease field schema",
              description: "Disease field schema generated by the CEDAR Template Editor 2.6.62",
              _ui: {
                inputType: "textfield",
                valueRecommendationEnabled: true,
              },
              _valueConstraints: {
                requiredValue: false,
                ontologies: [
                ],
                valueSets: [
                ],
                classes: [
                ],
                branches: [
                  {
                    source: "Human Disease Ontology (DOID)",
                    acronym: "DOID",
                    uri: "http://purl.obolibrary.org/obo/DOID_4",
                    name: "disease",
                    maxDepth: 0,
                  },
                ],
                multipleChoice: false,
              },
              properties: {
                "@type": {
                  oneOf: [
                    {
                      type: "string",
                      format: "uri",
                    },
                    {
                      type: "array",
                      minItems: 1,
                      items: {
                        type: "string",
                        format: "uri",
                      },
                      uniqueItems: true,
                    },
                  ],
                },
                "rdfs:label": {
                  type: [
                    "string",
                    "null",
                  ],
                },
                "@id": {
                  type: "string",
                  format: "uri",
                },
              },
              "schema:name": "Disease",
              "schema:description": "",
              "pav:createdOn": "2024-11-20T03:41:06-08:00",
              "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "pav:lastUpdatedOn": "2024-11-20T03:41:06-08:00",
              "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "schema:schemaVersion": "1.6.0",
              additionalProperties: false,
              "skos:prefLabel": "Disease",
              "@id": "https://repo.metadatacenter.org/template-fields/12568f68-27d2-437a-8681-9edd767647d0",
              $schema: "http://json-schema.org/draft-04/schema#",
              _path: "IJC_sample_metadata.Disease",
            },
            "Primary culture": {
              "@type": "https://schema.metadatacenter.org/core/TemplateField",
              "@context": {
                xsd: "http://www.w3.org/2001/XMLSchema#",
                pav: "http://purl.org/pav/",
                bibo: "http://purl.org/ontology/bibo/",
                oslc: "http://open-services.net/ns/core#",
                schema: "http://schema.org/",
                skos: "http://www.w3.org/2004/02/skos/core#",
                "schema:name": {
                  "@type": "xsd:string",
                },
                "schema:description": {
                  "@type": "xsd:string",
                },
                "skos:prefLabel": {
                  "@type": "xsd:string",
                },
                "skos:altLabel": {
                  "@type": "xsd:string",
                },
                "pav:createdOn": {
                  "@type": "xsd:dateTime",
                },
                "pav:createdBy": {
                  "@type": "@id",
                },
                "pav:lastUpdatedOn": {
                  "@type": "xsd:dateTime",
                },
                "oslc:modifiedBy": {
                  "@type": "@id",
                },
              },
              type: "object",
              title: "Primary culture field schema",
              description: "Primary culture field schema generated by the CEDAR Template Editor 2.6.62",
              _ui: {
                inputType: "radio",
              },
              _valueConstraints: {
                requiredValue: false,
                multipleChoice: false,
                literals: [
                  {
                    label: "yes",
                  },
                  {
                    label: "no",
                  },
                ],
              },
              properties: {
                "@type": {
                  oneOf: [
                    {
                      type: "string",
                      format: "uri",
                    },
                    {
                      type: "array",
                      minItems: 1,
                      items: {
                        type: "string",
                        format: "uri",
                      },
                      uniqueItems: true,
                    },
                  ],
                },
                "@value": {
                  type: [
                    "string",
                    "null",
                  ],
                },
                "rdfs:label": {
                  type: [
                    "string",
                    "null",
                  ],
                },
              },
              required: [
                "@value",
              ],
              "schema:name": "Primary culture",
              "schema:description": "",
              "pav:createdOn": "2024-11-20T03:41:06-08:00",
              "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "pav:lastUpdatedOn": "2024-11-20T03:41:06-08:00",
              "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "schema:schemaVersion": "1.6.0",
              additionalProperties: false,
              "@id": "https://repo.metadatacenter.org/template-fields/53fc77ae-c0d2-4cd5-8c66-11e2e45e22de",
              $schema: "http://json-schema.org/draft-04/schema#",
              _path: "IJC_sample_metadata.Primary culture",
            },
            "Sample Provider": {
              "@type": "https://schema.metadatacenter.org/core/TemplateField",
              "@context": {
                xsd: "http://www.w3.org/2001/XMLSchema#",
                pav: "http://purl.org/pav/",
                bibo: "http://purl.org/ontology/bibo/",
                oslc: "http://open-services.net/ns/core#",
                schema: "http://schema.org/",
                skos: "http://www.w3.org/2004/02/skos/core#",
                "schema:name": {
                  "@type": "xsd:string",
                },
                "schema:description": {
                  "@type": "xsd:string",
                },
                "skos:prefLabel": {
                  "@type": "xsd:string",
                },
                "skos:altLabel": {
                  "@type": "xsd:string",
                },
                "pav:createdOn": {
                  "@type": "xsd:dateTime",
                },
                "pav:createdBy": {
                  "@type": "@id",
                },
                "pav:lastUpdatedOn": {
                  "@type": "xsd:dateTime",
                },
                "oslc:modifiedBy": {
                  "@type": "@id",
                },
              },
              type: "object",
              title: "Sample Provider field schema",
              description: "Sample Provider field schema generated by the CEDAR Template Editor 2.6.62",
              _ui: {
                inputType: "textfield",
              },
              _valueConstraints: {
                requiredValue: false,
              },
              properties: {
                "@type": {
                  oneOf: [
                    {
                      type: "string",
                      format: "uri",
                    },
                    {
                      type: "array",
                      minItems: 1,
                      items: {
                        type: "string",
                        format: "uri",
                      },
                      uniqueItems: true,
                    },
                  ],
                },
                "@value": {
                  type: [
                    "string",
                    "null",
                  ],
                },
                "rdfs:label": {
                  type: [
                    "string",
                    "null",
                  ],
                },
              },
              required: [
                "@value",
              ],
              "schema:name": "Sample Provider",
              "schema:description": "",
              "pav:createdOn": "2024-11-20T03:41:06-08:00",
              "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "pav:lastUpdatedOn": "2024-11-20T03:41:06-08:00",
              "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "schema:schemaVersion": "1.6.0",
              additionalProperties: false,
              "skos:prefLabel": "Sample Provider",
              "@id": "https://repo.metadatacenter.org/template-fields/da3d10f5-0508-4e78-b244-1b127cae4756",
              $schema: "http://json-schema.org/draft-04/schema#",
              _path: "IJC_sample_metadata.Sample Provider",
            },
            "Other species": {
              "@type": "https://schema.metadatacenter.org/core/TemplateField",
              "@context": {
                xsd: "http://www.w3.org/2001/XMLSchema#",
                pav: "http://purl.org/pav/",
                bibo: "http://purl.org/ontology/bibo/",
                oslc: "http://open-services.net/ns/core#",
                schema: "http://schema.org/",
                skos: "http://www.w3.org/2004/02/skos/core#",
                "schema:name": {
                  "@type": "xsd:string",
                },
                "schema:description": {
                  "@type": "xsd:string",
                },
                "skos:prefLabel": {
                  "@type": "xsd:string",
                },
                "skos:altLabel": {
                  "@type": "xsd:string",
                },
                "pav:createdOn": {
                  "@type": "xsd:dateTime",
                },
                "pav:createdBy": {
                  "@type": "@id",
                },
                "pav:lastUpdatedOn": {
                  "@type": "xsd:dateTime",
                },
                "oslc:modifiedBy": {
                  "@type": "@id",
                },
              },
              type: "object",
              title: "Other species field schema",
              description: "Other species field schema generated by the CEDAR Template Editor 2.6.62",
              _ui: {
                inputType: "textfield",
              },
              _valueConstraints: {
                requiredValue: false,
              },
              properties: {
                "@type": {
                  oneOf: [
                    {
                      type: "string",
                      format: "uri",
                    },
                    {
                      type: "array",
                      minItems: 1,
                      items: {
                        type: "string",
                        format: "uri",
                      },
                      uniqueItems: true,
                    },
                  ],
                },
                "@value": {
                  type: [
                    "string",
                    "null",
                  ],
                },
                "rdfs:label": {
                  type: [
                    "string",
                    "null",
                  ],
                },
              },
              required: [
                "@value",
              ],
              "schema:name": "Other species",
              "schema:description": "Fill in case you have selected \"Other\" as species",
              "pav:createdOn": "2024-11-20T03:41:06-08:00",
              "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "pav:lastUpdatedOn": "2024-11-20T03:41:06-08:00",
              "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "schema:schemaVersion": "1.6.0",
              additionalProperties: false,
              "skos:prefLabel": "Other species",
              "@id": "https://repo.metadatacenter.org/template-fields/bd4d5911-dd78-42d7-80bf-26eaea753f43",
              $schema: "http://json-schema.org/draft-04/schema#",
              _path: "IJC_sample_metadata.Other species",
            },
            Sex: {
              "@type": "https://schema.metadatacenter.org/core/TemplateField",
              "@context": {
                xsd: "http://www.w3.org/2001/XMLSchema#",
                pav: "http://purl.org/pav/",
                bibo: "http://purl.org/ontology/bibo/",
                oslc: "http://open-services.net/ns/core#",
                schema: "http://schema.org/",
                skos: "http://www.w3.org/2004/02/skos/core#",
                "schema:name": {
                  "@type": "xsd:string",
                },
                "schema:description": {
                  "@type": "xsd:string",
                },
                "skos:prefLabel": {
                  "@type": "xsd:string",
                },
                "skos:altLabel": {
                  "@type": "xsd:string",
                },
                "pav:createdOn": {
                  "@type": "xsd:dateTime",
                },
                "pav:createdBy": {
                  "@type": "@id",
                },
                "pav:lastUpdatedOn": {
                  "@type": "xsd:dateTime",
                },
                "oslc:modifiedBy": {
                  "@type": "@id",
                },
              },
              type: "object",
              title: "Sex field schema",
              description: "Sex field schema generated by the CEDAR Template Editor 2.6.62",
              _ui: {
                inputType: "list",
              },
              _valueConstraints: {
                requiredValue: true,
                multipleChoice: false,
                literals: [
                  {
                    label: "Female",
                  },
                  {
                    label: "Male",
                  },
                  {
                    label: "Unknown",
                  },
                  {
                    label: "Other",
                  },
                ],
              },
              properties: {
                "@type": {
                  oneOf: [
                    {
                      type: "string",
                      format: "uri",
                    },
                    {
                      type: "array",
                      minItems: 1,
                      items: {
                        type: "string",
                        format: "uri",
                      },
                      uniqueItems: true,
                    },
                  ],
                },
                "@value": {
                  type: [
                    "string",
                    "null",
                  ],
                },
                "rdfs:label": {
                  type: [
                    "string",
                    "null",
                  ],
                },
              },
              required: [
                "@value",
              ],
              "schema:name": "Sex",
              "schema:description": "",
              "pav:createdOn": "2024-11-20T03:41:06-08:00",
              "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "pav:lastUpdatedOn": "2024-11-20T03:41:06-08:00",
              "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "schema:schemaVersion": "1.6.0",
              additionalProperties: false,
              "skos:prefLabel": "Sex",
              "@id": "https://repo.metadatacenter.org/template-fields/bfd1ebfa-aad0-48d2-a193-c5b7dc1f0277",
              $schema: "http://json-schema.org/draft-04/schema#",
              _path: "IJC_sample_metadata.Sex",
            },
            "Development stage": {
              "@type": "https://schema.metadatacenter.org/core/TemplateField",
              "@context": {
                xsd: "http://www.w3.org/2001/XMLSchema#",
                pav: "http://purl.org/pav/",
                bibo: "http://purl.org/ontology/bibo/",
                oslc: "http://open-services.net/ns/core#",
                schema: "http://schema.org/",
                skos: "http://www.w3.org/2004/02/skos/core#",
                "schema:name": {
                  "@type": "xsd:string",
                },
                "schema:description": {
                  "@type": "xsd:string",
                },
                "skos:prefLabel": {
                  "@type": "xsd:string",
                },
                "skos:altLabel": {
                  "@type": "xsd:string",
                },
                "pav:createdOn": {
                  "@type": "xsd:dateTime",
                },
                "pav:createdBy": {
                  "@type": "@id",
                },
                "pav:lastUpdatedOn": {
                  "@type": "xsd:dateTime",
                },
                "oslc:modifiedBy": {
                  "@type": "@id",
                },
              },
              type: "object",
              title: "Development stage field schema",
              description: "Development stage field schema generated by the CEDAR Template Editor 2.6.62",
              _ui: {
                inputType: "list",
              },
              _valueConstraints: {
                requiredValue: false,
                multipleChoice: false,
                literals: [
                  {
                    label: "Prenatal",
                  },
                  {
                    label: "Neonatal",
                  },
                  {
                    label: "Child/Juvenile",
                  },
                  {
                    label: "Adult",
                  },
                ],
              },
              properties: {
                "@type": {
                  oneOf: [
                    {
                      type: "string",
                      format: "uri",
                    },
                    {
                      type: "array",
                      minItems: 1,
                      items: {
                        type: "string",
                        format: "uri",
                      },
                      uniqueItems: true,
                    },
                  ],
                },
                "@value": {
                  type: [
                    "string",
                    "null",
                  ],
                },
                "rdfs:label": {
                  type: [
                    "string",
                    "null",
                  ],
                },
              },
              required: [
                "@value",
              ],
              "schema:name": "Development stage",
              "schema:description": "",
              "pav:createdOn": "2024-11-20T03:41:06-08:00",
              "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "pav:lastUpdatedOn": "2024-11-20T03:41:06-08:00",
              "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "schema:schemaVersion": "1.6.0",
              additionalProperties: false,
              "skos:prefLabel": "Development stage",
              "@id": "https://repo.metadatacenter.org/template-fields/b24fa3ad-e941-478e-a05a-0bea54d4c2eb",
              $schema: "http://json-schema.org/draft-04/schema#",
              _path: "IJC_sample_metadata.Development stage",
            },
            "Sample origin": {
              "@type": "https://schema.metadatacenter.org/core/TemplateField",
              "@context": {
                xsd: "http://www.w3.org/2001/XMLSchema#",
                pav: "http://purl.org/pav/",
                bibo: "http://purl.org/ontology/bibo/",
                oslc: "http://open-services.net/ns/core#",
                schema: "http://schema.org/",
                skos: "http://www.w3.org/2004/02/skos/core#",
                "schema:name": {
                  "@type": "xsd:string",
                },
                "schema:description": {
                  "@type": "xsd:string",
                },
                "skos:prefLabel": {
                  "@type": "xsd:string",
                },
                "skos:altLabel": {
                  "@type": "xsd:string",
                },
                "pav:createdOn": {
                  "@type": "xsd:dateTime",
                },
                "pav:createdBy": {
                  "@type": "@id",
                },
                "pav:lastUpdatedOn": {
                  "@type": "xsd:dateTime",
                },
                "oslc:modifiedBy": {
                  "@type": "@id",
                },
              },
              type: "object",
              title: "Sample origin field schema",
              description: "Sample origin field schema generated by the CEDAR Template Editor 2.6.62",
              _ui: {
                inputType: "textfield",
                valueRecommendationEnabled: true,
              },
              _valueConstraints: {
                requiredValue: true,
                ontologies: [
                ],
                valueSets: [
                ],
                classes: [
                ],
                branches: [
                  {
                    source: "Uber Anatomy Ontology (UBERON)",
                    acronym: "UBERON",
                    uri: "http://purl.obolibrary.org/obo/UBERON_0001062",
                    name: "anatomical entity",
                    maxDepth: 0,
                  },
                ],
                multipleChoice: false,
              },
              properties: {
                "@type": {
                  oneOf: [
                    {
                      type: "string",
                      format: "uri",
                    },
                    {
                      type: "array",
                      minItems: 1,
                      items: {
                        type: "string",
                        format: "uri",
                      },
                      uniqueItems: true,
                    },
                  ],
                },
                "rdfs:label": {
                  type: [
                    "string",
                    "null",
                  ],
                },
                "@id": {
                  type: "string",
                  format: "uri",
                },
              },
              "schema:name": "Sample origin",
              "schema:description": "",
              "pav:createdOn": "2024-11-20T03:41:06-08:00",
              "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "pav:lastUpdatedOn": "2024-11-20T03:41:06-08:00",
              "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "schema:schemaVersion": "1.6.0",
              additionalProperties: false,
              "skos:prefLabel": "Sample origin",
              "@id": "https://repo.metadatacenter.org/template-fields/a4507058-f156-4f3a-9830-b8ffda33050d",
              $schema: "http://json-schema.org/draft-04/schema#",
              _path: "IJC_sample_metadata.Sample origin",
            },
            Celltype: {
              "@type": "https://schema.metadatacenter.org/core/TemplateField",
              "@context": {
                xsd: "http://www.w3.org/2001/XMLSchema#",
                pav: "http://purl.org/pav/",
                bibo: "http://purl.org/ontology/bibo/",
                oslc: "http://open-services.net/ns/core#",
                schema: "http://schema.org/",
                skos: "http://www.w3.org/2004/02/skos/core#",
                "schema:name": {
                  "@type": "xsd:string",
                },
                "schema:description": {
                  "@type": "xsd:string",
                },
                "skos:prefLabel": {
                  "@type": "xsd:string",
                },
                "skos:altLabel": {
                  "@type": "xsd:string",
                },
                "pav:createdOn": {
                  "@type": "xsd:dateTime",
                },
                "pav:createdBy": {
                  "@type": "@id",
                },
                "pav:lastUpdatedOn": {
                  "@type": "xsd:dateTime",
                },
                "oslc:modifiedBy": {
                  "@type": "@id",
                },
              },
              type: "object",
              title: "Celltype field schema",
              description: "Celltype field schema generated by the CEDAR Template Editor 2.6.62",
              _ui: {
                inputType: "textfield",
                valueRecommendationEnabled: true,
              },
              _valueConstraints: {
                requiredValue: true,
                ontologies: [
                ],
                valueSets: [
                ],
                classes: [
                ],
                branches: [
                  {
                    source: "BRENDA Tissue and Enzyme Source Ontology (BTO)",
                    acronym: "BTO",
                    uri: "http://purl.obolibrary.org/obo/BTO_0001489",
                    name: "whole body",
                    maxDepth: 0,
                  },
                ],
                multipleChoice: false,
              },
              properties: {
                "@type": {
                  oneOf: [
                    {
                      type: "string",
                      format: "uri",
                    },
                    {
                      type: "array",
                      minItems: 1,
                      items: {
                        type: "string",
                        format: "uri",
                      },
                      uniqueItems: true,
                    },
                  ],
                },
                "rdfs:label": {
                  type: [
                    "string",
                    "null",
                  ],
                },
                "@id": {
                  type: "string",
                  format: "uri",
                },
              },
              "schema:name": "Celltype",
              "schema:description": "",
              "pav:createdOn": "2024-11-20T03:41:06-08:00",
              "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "pav:lastUpdatedOn": "2024-11-20T03:41:06-08:00",
              "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "schema:schemaVersion": "1.6.0",
              additionalProperties: false,
              "skos:prefLabel": "Celltype",
              "@id": "https://repo.metadatacenter.org/template-fields/5e4b63d8-57b8-4d04-b0d3-6125e0097dcc",
              $schema: "http://json-schema.org/draft-04/schema#",
              _path: "IJC_sample_metadata.Celltype",
            },
            "Treatment specify": {
              "@type": "https://schema.metadatacenter.org/core/TemplateField",
              "@context": {
                xsd: "http://www.w3.org/2001/XMLSchema#",
                pav: "http://purl.org/pav/",
                bibo: "http://purl.org/ontology/bibo/",
                oslc: "http://open-services.net/ns/core#",
                schema: "http://schema.org/",
                skos: "http://www.w3.org/2004/02/skos/core#",
                "schema:name": {
                  "@type": "xsd:string",
                },
                "schema:description": {
                  "@type": "xsd:string",
                },
                "skos:prefLabel": {
                  "@type": "xsd:string",
                },
                "skos:altLabel": {
                  "@type": "xsd:string",
                },
                "pav:createdOn": {
                  "@type": "xsd:dateTime",
                },
                "pav:createdBy": {
                  "@type": "@id",
                },
                "pav:lastUpdatedOn": {
                  "@type": "xsd:dateTime",
                },
                "oslc:modifiedBy": {
                  "@type": "@id",
                },
              },
              type: "object",
              title: "Treatment specify field schema",
              description: "Treatment specify field schema generated by the CEDAR Template Editor 2.6.62",
              _ui: {
                inputType: "textarea",
              },
              _valueConstraints: {
                requiredValue: false,
              },
              properties: {
                "@type": {
                  oneOf: [
                    {
                      type: "string",
                      format: "uri",
                    },
                    {
                      type: "array",
                      minItems: 1,
                      items: {
                        type: "string",
                        format: "uri",
                      },
                      uniqueItems: true,
                    },
                  ],
                },
                "@value": {
                  type: [
                    "string",
                    "null",
                  ],
                },
                "rdfs:label": {
                  type: [
                    "string",
                    "null",
                  ],
                },
              },
              required: [
                "@value",
              ],
              "schema:name": "Treatment specify",
              "schema:description": "",
              "pav:createdOn": "2024-11-20T03:41:06-08:00",
              "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "pav:lastUpdatedOn": "2024-11-20T03:41:06-08:00",
              "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "schema:schemaVersion": "1.6.0",
              additionalProperties: false,
              "@id": "https://repo.metadatacenter.org/template-fields/56a054f5-ee6d-4f5e-afe2-675c23e53560",
              "skos:prefLabel": "Treatment specify",
              $schema: "http://json-schema.org/draft-04/schema#",
              _path: "IJC_sample_metadata.Treatment specify",
            },
            "Cell Line Name": {
              "@type": "https://schema.metadatacenter.org/core/TemplateField",
              "@context": {
                xsd: "http://www.w3.org/2001/XMLSchema#",
                pav: "http://purl.org/pav/",
                bibo: "http://purl.org/ontology/bibo/",
                oslc: "http://open-services.net/ns/core#",
                schema: "http://schema.org/",
                skos: "http://www.w3.org/2004/02/skos/core#",
                "schema:name": {
                  "@type": "xsd:string",
                },
                "schema:description": {
                  "@type": "xsd:string",
                },
                "skos:prefLabel": {
                  "@type": "xsd:string",
                },
                "skos:altLabel": {
                  "@type": "xsd:string",
                },
                "pav:createdOn": {
                  "@type": "xsd:dateTime",
                },
                "pav:createdBy": {
                  "@type": "@id",
                },
                "pav:lastUpdatedOn": {
                  "@type": "xsd:dateTime",
                },
                "oslc:modifiedBy": {
                  "@type": "@id",
                },
              },
              type: "object",
              title: "Cell Line Name field schema",
              description: "Cell Line Name field schema generated by the CEDAR Template Editor 2.6.62",
              _ui: {
                inputType: "textfield",
              },
              _valueConstraints: {
                requiredValue: false,
              },
              properties: {
                "@type": {
                  oneOf: [
                    {
                      type: "string",
                      format: "uri",
                    },
                    {
                      type: "array",
                      minItems: 1,
                      items: {
                        type: "string",
                        format: "uri",
                      },
                      uniqueItems: true,
                    },
                  ],
                },
                "@value": {
                  type: [
                    "string",
                    "null",
                  ],
                },
                "rdfs:label": {
                  type: [
                    "string",
                    "null",
                  ],
                },
              },
              required: [
                "@value",
              ],
              "schema:name": "Cell Line Name",
              "schema:description": "",
              "pav:createdOn": "2024-11-20T03:41:06-08:00",
              "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "pav:lastUpdatedOn": "2024-11-20T03:41:06-08:00",
              "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "schema:schemaVersion": "1.6.0",
              additionalProperties: false,
              "skos:prefLabel": "Cell Line Name",
              "@id": "https://repo.metadatacenter.org/template-fields/08f25588-9817-4c1e-9707-2991f1c3ac9a",
              $schema: "http://json-schema.org/draft-04/schema#",
              _path: "IJC_sample_metadata.Cell Line Name",
            },
            "Tumor subtype": {
              "@type": "https://schema.metadatacenter.org/core/TemplateField",
              "@context": {
                xsd: "http://www.w3.org/2001/XMLSchema#",
                pav: "http://purl.org/pav/",
                bibo: "http://purl.org/ontology/bibo/",
                oslc: "http://open-services.net/ns/core#",
                schema: "http://schema.org/",
                skos: "http://www.w3.org/2004/02/skos/core#",
                "schema:name": {
                  "@type": "xsd:string",
                },
                "schema:description": {
                  "@type": "xsd:string",
                },
                "skos:prefLabel": {
                  "@type": "xsd:string",
                },
                "skos:altLabel": {
                  "@type": "xsd:string",
                },
                "pav:createdOn": {
                  "@type": "xsd:dateTime",
                },
                "pav:createdBy": {
                  "@type": "@id",
                },
                "pav:lastUpdatedOn": {
                  "@type": "xsd:dateTime",
                },
                "oslc:modifiedBy": {
                  "@type": "@id",
                },
              },
              type: "object",
              title: "Tumor subtype field schema",
              description: "Tumor subtype field schema generated by the CEDAR Template Editor 2.6.62",
              _ui: {
                inputType: "textfield",
              },
              _valueConstraints: {
                requiredValue: false,
                ontologies: [
                ],
                valueSets: [
                ],
                classes: [
                ],
                branches: [
                  {
                    source: "SNOMED CT (SNOMEDCT)",
                    acronym: "SNOMEDCT",
                    uri: "http://purl.bioontology.org/ontology/SNOMEDCT/416939005",
                    name: "Proliferative mass",
                    maxDepth: 0,
                  },
                ],
                multipleChoice: false,
              },
              properties: {
                "@type": {
                  oneOf: [
                    {
                      type: "string",
                      format: "uri",
                    },
                    {
                      type: "array",
                      minItems: 1,
                      items: {
                        type: "string",
                        format: "uri",
                      },
                      uniqueItems: true,
                    },
                  ],
                },
                "rdfs:label": {
                  type: [
                    "string",
                    "null",
                  ],
                },
                "@id": {
                  type: "string",
                  format: "uri",
                },
              },
              "schema:name": "Tumor subtype",
              "schema:description": "Morphological type",
              "pav:createdOn": "2024-11-20T03:41:06-08:00",
              "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "pav:lastUpdatedOn": "2024-11-20T03:41:06-08:00",
              "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "schema:schemaVersion": "1.6.0",
              additionalProperties: false,
              "skos:prefLabel": "Tumor subtype",
              "@id": "https://repo.metadatacenter.org/template-fields/166df551-5845-450a-876e-c8ffdd82a3d3",
              $schema: "http://json-schema.org/draft-04/schema#",
              _path: "IJC_sample_metadata.Tumor subtype",
            },
            Treatement: {
              "@type": "https://schema.metadatacenter.org/core/TemplateField",
              "@context": {
                xsd: "http://www.w3.org/2001/XMLSchema#",
                pav: "http://purl.org/pav/",
                bibo: "http://purl.org/ontology/bibo/",
                oslc: "http://open-services.net/ns/core#",
                schema: "http://schema.org/",
                skos: "http://www.w3.org/2004/02/skos/core#",
                "schema:name": {
                  "@type": "xsd:string",
                },
                "schema:description": {
                  "@type": "xsd:string",
                },
                "skos:prefLabel": {
                  "@type": "xsd:string",
                },
                "skos:altLabel": {
                  "@type": "xsd:string",
                },
                "pav:createdOn": {
                  "@type": "xsd:dateTime",
                },
                "pav:createdBy": {
                  "@type": "@id",
                },
                "pav:lastUpdatedOn": {
                  "@type": "xsd:dateTime",
                },
                "oslc:modifiedBy": {
                  "@type": "@id",
                },
              },
              type: "object",
              title: "Treatement field schema",
              description: "Treatement field schema generated by the CEDAR Template Editor 2.6.62",
              _ui: {
                inputType: "radio",
              },
              _valueConstraints: {
                requiredValue: true,
                multipleChoice: false,
                literals: [
                  {
                    label: "Yes",
                  },
                  {
                    label: "No",
                  },
                ],
              },
              properties: {
                "@type": {
                  oneOf: [
                    {
                      type: "string",
                      format: "uri",
                    },
                    {
                      type: "array",
                      minItems: 1,
                      items: {
                        type: "string",
                        format: "uri",
                      },
                      uniqueItems: true,
                    },
                  ],
                },
                "@value": {
                  type: [
                    "string",
                    "null",
                  ],
                },
                "rdfs:label": {
                  type: [
                    "string",
                    "null",
                  ],
                },
              },
              required: [
                "@value",
              ],
              "schema:name": "Treatement",
              "schema:description": "",
              "pav:createdOn": "2024-11-20T03:41:06-08:00",
              "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "pav:lastUpdatedOn": "2024-11-20T03:41:06-08:00",
              "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "schema:schemaVersion": "1.6.0",
              additionalProperties: false,
              "skos:prefLabel": "Treatement",
              "@id": "https://repo.metadatacenter.org/template-fields/8708ec1b-767b-45d8-90e0-55dfda8c1025",
              $schema: "http://json-schema.org/draft-04/schema#",
              _path: "IJC_sample_metadata.Treatement",
            },
            "Patient clinical data available": {
              "@type": "https://schema.metadatacenter.org/core/TemplateField",
              "@context": {
                xsd: "http://www.w3.org/2001/XMLSchema#",
                pav: "http://purl.org/pav/",
                bibo: "http://purl.org/ontology/bibo/",
                oslc: "http://open-services.net/ns/core#",
                schema: "http://schema.org/",
                skos: "http://www.w3.org/2004/02/skos/core#",
                "schema:name": {
                  "@type": "xsd:string",
                },
                "schema:description": {
                  "@type": "xsd:string",
                },
                "skos:prefLabel": {
                  "@type": "xsd:string",
                },
                "skos:altLabel": {
                  "@type": "xsd:string",
                },
                "pav:createdOn": {
                  "@type": "xsd:dateTime",
                },
                "pav:createdBy": {
                  "@type": "@id",
                },
                "pav:lastUpdatedOn": {
                  "@type": "xsd:dateTime",
                },
                "oslc:modifiedBy": {
                  "@type": "@id",
                },
              },
              type: "object",
              title: "Patient clinical data available field schema",
              description: "Patient clinical data available field schema generated by the CEDAR Template Editor 2.6.62",
              _ui: {
                inputType: "radio",
              },
              _valueConstraints: {
                requiredValue: false,
                multipleChoice: false,
                literals: [
                  {
                    label: "Yes",
                  },
                  {
                    label: "No",
                  },
                ],
              },
              properties: {
                "@type": {
                  oneOf: [
                    {
                      type: "string",
                      format: "uri",
                    },
                    {
                      type: "array",
                      minItems: 1,
                      items: {
                        type: "string",
                        format: "uri",
                      },
                      uniqueItems: true,
                    },
                  ],
                },
                "@value": {
                  type: [
                    "string",
                    "null",
                  ],
                },
                "rdfs:label": {
                  type: [
                    "string",
                    "null",
                  ],
                },
              },
              required: [
                "@value",
              ],
              "schema:name": "Patient clinical data available",
              "schema:description": "",
              "pav:createdOn": "2024-11-20T03:41:06-08:00",
              "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "pav:lastUpdatedOn": "2024-11-20T03:41:06-08:00",
              "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "schema:schemaVersion": "1.6.0",
              additionalProperties: false,
              "skos:prefLabel": "Patient clinical data available",
              "@id": "https://repo.metadatacenter.org/template-fields/a181b916-34c7-4768-85cc-727e92def992",
              $schema: "http://json-schema.org/draft-04/schema#",
              _path: "IJC_sample_metadata.Patient clinical data available",
            },
            "Patient survival data available": {
              "@type": "https://schema.metadatacenter.org/core/TemplateField",
              "@context": {
                xsd: "http://www.w3.org/2001/XMLSchema#",
                pav: "http://purl.org/pav/",
                bibo: "http://purl.org/ontology/bibo/",
                oslc: "http://open-services.net/ns/core#",
                schema: "http://schema.org/",
                skos: "http://www.w3.org/2004/02/skos/core#",
                "schema:name": {
                  "@type": "xsd:string",
                },
                "schema:description": {
                  "@type": "xsd:string",
                },
                "skos:prefLabel": {
                  "@type": "xsd:string",
                },
                "skos:altLabel": {
                  "@type": "xsd:string",
                },
                "pav:createdOn": {
                  "@type": "xsd:dateTime",
                },
                "pav:createdBy": {
                  "@type": "@id",
                },
                "pav:lastUpdatedOn": {
                  "@type": "xsd:dateTime",
                },
                "oslc:modifiedBy": {
                  "@type": "@id",
                },
              },
              type: "object",
              title: "Patient survival data available field schema",
              description: "Patient survival data available field schema generated by the CEDAR Template Editor 2.6.62",
              _ui: {
                inputType: "radio",
              },
              _valueConstraints: {
                requiredValue: false,
                multipleChoice: false,
                literals: [
                  {
                    label: "Yes",
                  },
                  {
                    label: "No",
                  },
                ],
              },
              properties: {
                "@type": {
                  oneOf: [
                    {
                      type: "string",
                      format: "uri",
                    },
                    {
                      type: "array",
                      minItems: 1,
                      items: {
                        type: "string",
                        format: "uri",
                      },
                      uniqueItems: true,
                    },
                  ],
                },
                "@value": {
                  type: [
                    "string",
                    "null",
                  ],
                },
                "rdfs:label": {
                  type: [
                    "string",
                    "null",
                  ],
                },
              },
              required: [
                "@value",
              ],
              "schema:name": "Patient survival data available",
              "schema:description": "",
              "pav:createdOn": "2024-11-20T03:41:06-08:00",
              "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "pav:lastUpdatedOn": "2024-11-20T03:41:06-08:00",
              "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "schema:schemaVersion": "1.6.0",
              additionalProperties: false,
              "skos:prefLabel": "Patient survival data available",
              "@id": "https://repo.metadatacenter.org/template-fields/79d7de82-ebcc-40b8-90f0-e738b754a211",
              $schema: "http://json-schema.org/draft-04/schema#",
              _path: "IJC_sample_metadata.Patient survival data available",
            },
            "Sample name": {
              "@type": "https://schema.metadatacenter.org/core/TemplateField",
              "@context": {
                xsd: "http://www.w3.org/2001/XMLSchema#",
                pav: "http://purl.org/pav/",
                bibo: "http://purl.org/ontology/bibo/",
                oslc: "http://open-services.net/ns/core#",
                schema: "http://schema.org/",
                skos: "http://www.w3.org/2004/02/skos/core#",
                "schema:name": {
                  "@type": "xsd:string",
                },
                "schema:description": {
                  "@type": "xsd:string",
                },
                "skos:prefLabel": {
                  "@type": "xsd:string",
                },
                "skos:altLabel": {
                  "@type": "xsd:string",
                },
                "pav:createdOn": {
                  "@type": "xsd:dateTime",
                },
                "pav:createdBy": {
                  "@type": "@id",
                },
                "pav:lastUpdatedOn": {
                  "@type": "xsd:dateTime",
                },
                "oslc:modifiedBy": {
                  "@type": "@id",
                },
              },
              type: "object",
              title: "Sample name field schema",
              description: "Sample name field schema generated by the CEDAR Template Editor 2.7.1",
              _ui: {
                inputType: "textfield",
              },
              _valueConstraints: {
                requiredValue: true,
              },
              properties: {
                "@type": {
                  oneOf: [
                    {
                      type: "string",
                      format: "uri",
                    },
                    {
                      type: "array",
                      minItems: 1,
                      items: {
                        type: "string",
                        format: "uri",
                      },
                      uniqueItems: true,
                    },
                  ],
                },
                "@value": {
                  type: [
                    "string",
                    "null",
                  ],
                },
                "rdfs:label": {
                  type: [
                    "string",
                    "null",
                  ],
                },
              },
              required: [
                "@value",
              ],
              "schema:name": "Sample name",
              "schema:description": "",
              "pav:createdOn": "2024-11-20T03:41:06-08:00",
              "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "pav:lastUpdatedOn": "2024-11-20T03:41:06-08:00",
              "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "schema:schemaVersion": "1.6.0",
              additionalProperties: false,
              "skos:prefLabel": "Sample name",
              "@id": "https://repo.metadatacenter.org/template-fields/e5ac39dd-c264-465e-82ec-de1f73469c51",
              $schema: "http://json-schema.org/draft-04/schema#",
              _path: "IJC_sample_metadata.Sample name",
            },
            "Sample preservation": {
              type: "object",
              "@id": "https://repo.metadatacenter.org/template-fields/58e86939-3d40-4aa3-9bf5-dd4c1a39731b",
              "@type": "https://schema.metadatacenter.org/core/TemplateField",
              "@context": {
                xsd: "http://www.w3.org/2001/XMLSchema#",
                pav: "http://purl.org/pav/",
                bibo: "http://purl.org/ontology/bibo/",
                oslc: "http://open-services.net/ns/core#",
                schema: "http://schema.org/",
                skos: "http://www.w3.org/2004/02/skos/core#",
                "schema:name": {
                  "@type": "xsd:string",
                },
                "schema:description": {
                  "@type": "xsd:string",
                },
                "skos:prefLabel": {
                  "@type": "xsd:string",
                },
                "skos:altLabel": {
                  "@type": "xsd:string",
                },
                "pav:createdOn": {
                  "@type": "xsd:dateTime",
                },
                "pav:createdBy": {
                  "@type": "@id",
                },
                "pav:lastUpdatedOn": {
                  "@type": "xsd:dateTime",
                },
                "oslc:modifiedBy": {
                  "@type": "@id",
                },
              },
              title: "Sample preservation field schema",
              description: "Sample preservation field schema generated by the CEDAR Template Editor 2.7.1",
              _ui: {
                inputType: "list",
              },
              _valueConstraints: {
                requiredValue: false,
                multipleChoice: false,
                literals: [
                  {
                    label: "Formol",
                  },
                  {
                    label: "FFPE",
                  },
                  {
                    label: "FF_DNA",
                  },
                  {
                    label: "Frozen",
                  },
                  {
                    label: "Other",
                  },
                  {
                    label: "Unknown",
                  },
                ],
              },
              properties: {
                "@type": {
                  oneOf: [
                    {
                      type: "string",
                      format: "uri",
                    },
                    {
                      type: "array",
                      minItems: 1,
                      items: {
                        type: "string",
                        format: "uri",
                      },
                      uniqueItems: true,
                    },
                  ],
                },
                "@value": {
                  type: [
                    "string",
                    "null",
                  ],
                },
                "rdfs:label": {
                  type: [
                    "string",
                    "null",
                  ],
                },
              },
              required: [
                "@value",
              ],
              additionalProperties: false,
              "pav:createdOn": "2024-11-20T03:41:06-08:00",
              "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "pav:lastUpdatedOn": "2024-11-20T03:41:06-08:00",
              "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "schema:schemaVersion": "1.6.0",
              "schema:name": "Sample preservation",
              "schema:description": "",
              $schema: "http://json-schema.org/draft-04/schema#",
              _path: "IJC_sample_metadata.Sample preservation",
            },
            "DNA concentration measure technology": {
              "@type": "https://schema.metadatacenter.org/core/TemplateField",
              "@context": {
                xsd: "http://www.w3.org/2001/XMLSchema#",
                pav: "http://purl.org/pav/",
                bibo: "http://purl.org/ontology/bibo/",
                oslc: "http://open-services.net/ns/core#",
                schema: "http://schema.org/",
                skos: "http://www.w3.org/2004/02/skos/core#",
                "schema:name": {
                  "@type": "xsd:string",
                },
                "schema:description": {
                  "@type": "xsd:string",
                },
                "skos:prefLabel": {
                  "@type": "xsd:string",
                },
                "skos:altLabel": {
                  "@type": "xsd:string",
                },
                "pav:createdOn": {
                  "@type": "xsd:dateTime",
                },
                "pav:createdBy": {
                  "@type": "@id",
                },
                "pav:lastUpdatedOn": {
                  "@type": "xsd:dateTime",
                },
                "oslc:modifiedBy": {
                  "@type": "@id",
                },
              },
              type: "object",
              title: "DNA concentration measure technology field schema",
              description: "DNA concentration measure technology field schema generated by the CEDAR Template Editor 2.7.1",
              _ui: {
                inputType: "list",
              },
              _valueConstraints: {
                requiredValue: false,
                multipleChoice: false,
                literals: [
                  {
                    label: "Pyrosequencing",
                  },
                  {
                    label: "Other",
                  },
                  {
                    label: "Does not apply",
                  },
                ],
              },
              properties: {
                "@type": {
                  oneOf: [
                    {
                      type: "string",
                      format: "uri",
                    },
                    {
                      type: "array",
                      minItems: 1,
                      items: {
                        type: "string",
                        format: "uri",
                      },
                      uniqueItems: true,
                    },
                  ],
                },
                "@value": {
                  type: [
                    "string",
                    "null",
                  ],
                },
                "rdfs:label": {
                  type: [
                    "string",
                    "null",
                  ],
                },
              },
              required: [
                "@value",
              ],
              "schema:name": "DNA concentration measure technology",
              "schema:description": "",
              "pav:createdOn": "2024-11-20T03:41:06-08:00",
              "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "pav:lastUpdatedOn": "2024-11-20T03:41:06-08:00",
              "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "schema:schemaVersion": "1.6.0",
              additionalProperties: false,
              "@id": "https://repo.metadatacenter.org/template-fields/05dcac16-580d-4a76-abf7-80ffb9c8b528",
              $schema: "http://json-schema.org/draft-04/schema#",
              _path: "IJC_sample_metadata.DNA concentration measure technology",
            },
            Notes: {
              "@type": "https://schema.metadatacenter.org/core/TemplateField",
              "@context": {
                xsd: "http://www.w3.org/2001/XMLSchema#",
                pav: "http://purl.org/pav/",
                bibo: "http://purl.org/ontology/bibo/",
                oslc: "http://open-services.net/ns/core#",
                schema: "http://schema.org/",
                skos: "http://www.w3.org/2004/02/skos/core#",
                "schema:name": {
                  "@type": "xsd:string",
                },
                "schema:description": {
                  "@type": "xsd:string",
                },
                "skos:prefLabel": {
                  "@type": "xsd:string",
                },
                "skos:altLabel": {
                  "@type": "xsd:string",
                },
                "pav:createdOn": {
                  "@type": "xsd:dateTime",
                },
                "pav:createdBy": {
                  "@type": "@id",
                },
                "pav:lastUpdatedOn": {
                  "@type": "xsd:dateTime",
                },
                "oslc:modifiedBy": {
                  "@type": "@id",
                },
              },
              type: "object",
              title: "Notes field schema",
              description: "Notes field schema generated by the CEDAR Template Editor 2.7.1",
              _ui: {
                inputType: "textarea",
              },
              _valueConstraints: {
                requiredValue: false,
              },
              properties: {
                "@type": {
                  oneOf: [
                    {
                      type: "string",
                      format: "uri",
                    },
                    {
                      type: "array",
                      minItems: 1,
                      items: {
                        type: "string",
                        format: "uri",
                      },
                      uniqueItems: true,
                    },
                  ],
                },
                "@value": {
                  type: [
                    "string",
                    "null",
                  ],
                },
                "rdfs:label": {
                  type: [
                    "string",
                    "null",
                  ],
                },
              },
              required: [
                "@value",
              ],
              "schema:name": "Notes",
              "schema:description": "",
              "pav:createdOn": "2024-11-20T03:41:06-08:00",
              "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "pav:lastUpdatedOn": "2024-11-20T03:41:06-08:00",
              "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "schema:schemaVersion": "1.6.0",
              additionalProperties: false,
              "@id": "https://repo.metadatacenter.org/template-fields/a84d6ecc-0d7f-4eb1-b767-442542d7b1a8",
              $schema: "http://json-schema.org/draft-04/schema#",
              _path: "IJC_sample_metadata.Notes",
            },
            Species: {
              "@type": "https://schema.metadatacenter.org/core/TemplateField",
              "@context": {
                xsd: "http://www.w3.org/2001/XMLSchema#",
                pav: "http://purl.org/pav/",
                bibo: "http://purl.org/ontology/bibo/",
                oslc: "http://open-services.net/ns/core#",
                schema: "http://schema.org/",
                skos: "http://www.w3.org/2004/02/skos/core#",
                "schema:name": {
                  "@type": "xsd:string",
                },
                "schema:description": {
                  "@type": "xsd:string",
                },
                "skos:prefLabel": {
                  "@type": "xsd:string",
                },
                "skos:altLabel": {
                  "@type": "xsd:string",
                },
                "pav:createdOn": {
                  "@type": "xsd:dateTime",
                },
                "pav:createdBy": {
                  "@type": "@id",
                },
                "pav:lastUpdatedOn": {
                  "@type": "xsd:dateTime",
                },
                "oslc:modifiedBy": {
                  "@type": "@id",
                },
              },
              type: "object",
              title: "Species field schema",
              description: "Species field schema generated by the CEDAR Template Editor 2.7.1",
              _ui: {
                inputType: "list",
              },
              _valueConstraints: {
                requiredValue: true,
                multipleChoice: false,
                literals: [
                  {
                    label: "Homo sapiens",
                  },
                  {
                    label: "Rattus norvegicus",
                  },
                  {
                    label: "Mus musculus",
                  },
                  {
                    label: "Gallus gallus",
                  },
                  {
                    label: "Other. Specify in the \"Other species\" field",
                  },
                ],
              },
              properties: {
                "@type": {
                  oneOf: [
                    {
                      type: "string",
                      format: "uri",
                    },
                    {
                      type: "array",
                      minItems: 1,
                      items: {
                        type: "string",
                        format: "uri",
                      },
                      uniqueItems: true,
                    },
                  ],
                },
                "@value": {
                  type: [
                    "string",
                    "null",
                  ],
                },
                "rdfs:label": {
                  type: [
                    "string",
                    "null",
                  ],
                },
              },
              required: [
                "@value",
              ],
              "schema:name": "Species",
              "schema:description": "",
              "pav:createdOn": "2024-11-20T03:41:06-08:00",
              "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "pav:lastUpdatedOn": "2024-11-20T03:41:06-08:00",
              "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "schema:schemaVersion": "1.6.0",
              additionalProperties: false,
              "@id": "https://repo.metadatacenter.org/template-fields/93c87858-15a7-47d2-99ba-25dca29d3e84",
              $schema: "http://json-schema.org/draft-04/schema#",
              _path: "IJC_sample_metadata.Species",
            },
            "Age value": {
              "@type": "https://schema.metadatacenter.org/core/TemplateField",
              "@context": {
                xsd: "http://www.w3.org/2001/XMLSchema#",
                pav: "http://purl.org/pav/",
                bibo: "http://purl.org/ontology/bibo/",
                oslc: "http://open-services.net/ns/core#",
                schema: "http://schema.org/",
                skos: "http://www.w3.org/2004/02/skos/core#",
                "schema:name": {
                  "@type": "xsd:string",
                },
                "schema:description": {
                  "@type": "xsd:string",
                },
                "skos:prefLabel": {
                  "@type": "xsd:string",
                },
                "skos:altLabel": {
                  "@type": "xsd:string",
                },
                "pav:createdOn": {
                  "@type": "xsd:dateTime",
                },
                "pav:createdBy": {
                  "@type": "@id",
                },
                "pav:lastUpdatedOn": {
                  "@type": "xsd:dateTime",
                },
                "oslc:modifiedBy": {
                  "@type": "@id",
                },
              },
              type: "object",
              title: "Age value field schema",
              description: "Age value field schema generated by the CEDAR Template Editor 2.7.1",
              _ui: {
                inputType: "numeric",
              },
              _valueConstraints: {
                requiredValue: false,
                numberType: "xsd:decimal",
              },
              properties: {
                "@value": {
                  type: [
                    "string",
                    "null",
                  ],
                },
                "rdfs:label": {
                  type: [
                    "string",
                    "null",
                  ],
                },
                "@type": {
                  type: "string",
                  format: "uri",
                },
              },
              required: [
                "@value",
                "@type",
              ],
              "schema:name": "Age value",
              "schema:description": "",
              "pav:createdOn": "2024-11-20T03:41:06-08:00",
              "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "pav:lastUpdatedOn": "2024-11-20T03:41:06-08:00",
              "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "schema:schemaVersion": "1.6.0",
              additionalProperties: false,
              "@id": "https://repo.metadatacenter.org/template-fields/d3642d1d-abec-46c8-9d26-6e731b3f29d1",
              $schema: "http://json-schema.org/draft-04/schema#",
              _path: "IJC_sample_metadata.Age value",
            },
            "Age unit": {
              "@type": "https://schema.metadatacenter.org/core/TemplateField",
              "@context": {
                xsd: "http://www.w3.org/2001/XMLSchema#",
                pav: "http://purl.org/pav/",
                bibo: "http://purl.org/ontology/bibo/",
                oslc: "http://open-services.net/ns/core#",
                schema: "http://schema.org/",
                skos: "http://www.w3.org/2004/02/skos/core#",
                "schema:name": {
                  "@type": "xsd:string",
                },
                "schema:description": {
                  "@type": "xsd:string",
                },
                "skos:prefLabel": {
                  "@type": "xsd:string",
                },
                "skos:altLabel": {
                  "@type": "xsd:string",
                },
                "pav:createdOn": {
                  "@type": "xsd:dateTime",
                },
                "pav:createdBy": {
                  "@type": "@id",
                },
                "pav:lastUpdatedOn": {
                  "@type": "xsd:dateTime",
                },
                "oslc:modifiedBy": {
                  "@type": "@id",
                },
              },
              type: "object",
              title: "Age unit field schema",
              description: "Age unit field schema generated by the CEDAR Template Editor 2.7.1",
              _ui: {
                inputType: "radio",
              },
              _valueConstraints: {
                requiredValue: false,
                multipleChoice: false,
                literals: [
                  {
                    label: "Years",
                  },
                  {
                    label: "Days",
                  },
                ],
              },
              properties: {
                "@type": {
                  oneOf: [
                    {
                      type: "string",
                      format: "uri",
                    },
                    {
                      type: "array",
                      minItems: 1,
                      items: {
                        type: "string",
                        format: "uri",
                      },
                      uniqueItems: true,
                    },
                  ],
                },
                "@value": {
                  type: [
                    "string",
                    "null",
                  ],
                },
                "rdfs:label": {
                  type: [
                    "string",
                    "null",
                  ],
                },
              },
              required: [
                "@value",
              ],
              "schema:name": "Age unit",
              "schema:description": "",
              "pav:createdOn": "2024-11-20T03:41:06-08:00",
              "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "pav:lastUpdatedOn": "2024-11-20T03:41:06-08:00",
              "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
              "schema:schemaVersion": "1.6.0",
              additionalProperties: false,
              "@id": "https://repo.metadatacenter.org/template-fields/1f81652a-7c6b-488d-a78d-eb33ee266bf5",
              $schema: "http://json-schema.org/draft-04/schema#",
              _path: "IJC_sample_metadata.Age unit",
            },
          },
          "schema:name": "Samples",
          "schema:description": "",
          required: [
            "@context",
            "@id",
            "Sample name",
            "Sample Provider",
            "Sex",
            "Sample origin",
            "Celltype",
            "Tumor",
            "Control",
            "Disease",
            "Treatment specify",
            "Primary culture",
            "Cell Line Name",
            "Other species",
            "Development stage",
            "Tumor subtype",
            "Treatement",
            "Patient clinical data available",
            "Patient survival data available",
            "Sample preservation",
            "DNA concentration measure technology",
            "Notes",
            "Species",
            "Age value",
            "Age unit",
          ],
          "pav:createdOn": "2024-11-20T03:41:09-08:00",
          "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
          "pav:lastUpdatedOn": "2024-11-20T03:41:09-08:00",
          "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
          "schema:schemaVersion": "1.6.0",
          additionalProperties: false,
          "pav:version": "0.0.1",
          "bibo:status": "bibo:draft",
          "pav:derivedFrom": "https://repo.metadatacenter.org/template-elements/8001ce62-ffa1-4bba-84cb-5aabb20368fc",
          "@id": "https://repo.metadatacenter.org/template-elements/a6153c1b-4051-4f8b-91fc-0032d973df0f",
          "schema:identifier": "IJC_sample_metadata",
          $schema: "http://json-schema.org/draft-04/schema#",
        },
      },
      IJC_PI_contact_info: {
        "@id": "https://repo.metadatacenter.org/template-elements/5a3f4eab-9390-467c-9bf1-9bb1dabe81be",
        "@type": "https://schema.metadatacenter.org/core/TemplateElement",
        "@context": {
          xsd: "http://www.w3.org/2001/XMLSchema#",
          pav: "http://purl.org/pav/",
          bibo: "http://purl.org/ontology/bibo/",
          oslc: "http://open-services.net/ns/core#",
          schema: "http://schema.org/",
          "schema:name": {
            "@type": "xsd:string",
          },
          "schema:description": {
            "@type": "xsd:string",
          },
          "pav:createdOn": {
            "@type": "xsd:dateTime",
          },
          "pav:createdBy": {
            "@type": "@id",
          },
          "pav:lastUpdatedOn": {
            "@type": "xsd:dateTime",
          },
          "oslc:modifiedBy": {
            "@type": "@id",
          },
        },
        type: "object",
        title: "Ijc_contact_info element schema",
        description: "Ijc_contact_info element schema generated by the CEDAR Template Editor 2.6.62",
        _ui: {
          order: [
            "Name",
            "Email",
            "Principal_Investigator ORCID Text (10624734)",
            "IJC_institution-company",
          ],
          propertyLabels: {
            Name: "Name",
            Email: "Email",
            "Principal_Investigator ORCID Text (10624734)": "Principal_Investigator ORCID Text (10624734)",
            "IJC_institution-company": "IJC_institution-company",
          },
          propertyDescriptions: {
            Name: "",
            "Email address Contact": "",
            Email: "",
            ORCID: "",
            ORCID1: "",
            "Principal_Investigator ORCID Text (10624734)": "A persistent unique digital identifier assigned to a principal investigator by the Open Researcher and Contributor ID (ORCID) organization.",
            "IJC_institution-company": "",
          },
        },
        properties: {
          "@context": {
            type: "object",
            properties: {
              Name: {
                enum: [
                  "https://schema.metadatacenter.org/properties/882d1bc2-e9ad-4d26-86d2-47dbd5c32fcf",
                ],
              },
              Email: {
                enum: [
                  "https://schema.metadatacenter.org/properties/623bee44-e4f2-459a-85db-abd32a638e9f",
                ],
              },
              "Principal_Investigator ORCID Text (10624734)": {
                enum: [
                  "https://schema.metadatacenter.org/properties/7469493b-5033-4c1d-a53a-cff9fe78a5a2",
                ],
              },
              "IJC_institution-company": {
                enum: [
                  "https://schema.metadatacenter.org/properties/45c8aeac-6b90-4862-a27e-aeaf21df935e",
                ],
              },
            },
            additionalProperties: false,
            required: [
              "Name",
              "Email",
              "Principal_Investigator ORCID Text (10624734)",
              "IJC_institution-company",
            ],
          },
          "@id": {
            type: "string",
            format: "uri",
          },
          "@type": {
            oneOf: [
              {
                type: "string",
                format: "uri",
              },
              {
                type: "array",
                minItems: 1,
                items: {
                  type: "string",
                  format: "uri",
                },
                uniqueItems: true,
              },
            ],
          },
          Name: {
            "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
            "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
            "pav:createdOn": "2024-09-13T06:57:55-07:00",
            "pav:lastUpdatedOn": "2024-09-13T06:57:55-07:00",
            "@type": "https://schema.metadatacenter.org/core/TemplateField",
            "@id": "https://repo.metadatacenter.org/template-fields/868e28c2-5a62-4d48-879b-1b8ad3f2ed6d",
            type: "object",
            title: "Name field schema",
            description: "Name field schema generated by the CEDAR Artifact Library",
            "schema:name": "Name",
            "schema:description": "",
            "schema:schemaVersion": "1.6.0",
            "schema:identifier": "71_Wa_cj2ig",
            "pav:version": "1.0.0",
            "bibo:status": "bibo:published",
            "@context": {
              schema: "http://schema.org/",
              pav: "http://purl.org/pav/",
              xsd: "http://www.w3.org/2001/XMLSchema#",
              skos: "http://www.w3.org/2004/02/skos/core#",
              bibo: "http://purl.org/ontology/bibo/",
              oslc: "http://open-services.net/ns/core#",
              "schema:name": {
                "@type": "xsd:string",
              },
              "schema:description": {
                "@type": "xsd:string",
              },
              "pav:createdOn": {
                "@type": "xsd:dateTime",
              },
              "pav:createdBy": {
                "@type": "@id",
              },
              "pav:lastUpdatedOn": {
                "@type": "xsd:dateTime",
              },
              "oslc:modifiedBy": {
                "@type": "@id",
              },
              "skos:prefLabel": {
                "@type": "xsd:string",
              },
              "skos:altLabel": {
                "@type": "xsd:string",
              },
            },
            properties: {
              "@type": {
                oneOf: [
                  {
                    type: "string",
                    format: "uri",
                  },
                  {
                    type: "array",
                    minItems: 1,
                    items: {
                      type: "string",
                      format: "uri",
                    },
                    uniqueItems: true,
                  },
                ],
              },
              "rdfs:label": {
                type: [
                  "string",
                  "null",
                ],
              },
              "@value": {
                type: [
                  "string",
                  "null",
                ],
              },
            },
            additionalProperties: false,
            _valueConstraints: {
              literals: [
              ],
              requiredValue: false,
              multipleChoice: false,
            },
            "skos:prefLabel": "Name",
            "skos:altLabel": [
              "Name",
            ],
            _ui: {
              inputType: "textfield",
            },
            $schema: "http://json-schema.org/draft-04/schema#",
            _path: "IJC_PI_contact_info.Name",
            _tmp: {
              nested: true,
            },
          },
          Email: {
            "@type": "https://schema.metadatacenter.org/core/TemplateField",
            "@context": {
              xsd: "http://www.w3.org/2001/XMLSchema#",
              pav: "http://purl.org/pav/",
              bibo: "http://purl.org/ontology/bibo/",
              oslc: "http://open-services.net/ns/core#",
              schema: "http://schema.org/",
              skos: "http://www.w3.org/2004/02/skos/core#",
              "schema:name": {
                "@type": "xsd:string",
              },
              "schema:description": {
                "@type": "xsd:string",
              },
              "skos:prefLabel": {
                "@type": "xsd:string",
              },
              "skos:altLabel": {
                "@type": "xsd:string",
              },
              "pav:createdOn": {
                "@type": "xsd:dateTime",
              },
              "pav:createdBy": {
                "@type": "@id",
              },
              "pav:lastUpdatedOn": {
                "@type": "xsd:dateTime",
              },
              "oslc:modifiedBy": {
                "@type": "@id",
              },
            },
            type: "object",
            title: "Email field schema",
            description: "Email field schema generated by the CEDAR Template Editor 2.6.62",
            _ui: {
              inputType: "email",
            },
            _valueConstraints: {
              requiredValue: false,
            },
            properties: {
              "@type": {
                oneOf: [
                  {
                    type: "string",
                    format: "uri",
                  },
                  {
                    type: "array",
                    minItems: 1,
                    items: {
                      type: "string",
                      format: "uri",
                    },
                    uniqueItems: true,
                  },
                ],
              },
              "@value": {
                type: [
                  "string",
                  "null",
                ],
              },
              "rdfs:label": {
                type: [
                  "string",
                  "null",
                ],
              },
            },
            required: [
              "@value",
            ],
            "schema:name": "Email",
            "schema:description": "",
            "pav:createdOn": "2024-09-13T06:57:55-07:00",
            "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
            "pav:lastUpdatedOn": "2024-09-13T06:57:55-07:00",
            "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
            "schema:schemaVersion": "1.6.0",
            additionalProperties: false,
            "skos:prefLabel": "Email",
            "@id": "https://repo.metadatacenter.org/template-fields/85ea1946-39ea-4905-85ee-2b28658033ac",
            $schema: "http://json-schema.org/draft-04/schema#",
            _path: "IJC_PI_contact_info.Email",
            _tmp: {
              nested: true,
            },
          },
          "Principal_Investigator ORCID Text (10624734)": {
            "bibo:status": "bibo:published",
            "pav:version": "1.0.0",
            "@type": "https://schema.metadatacenter.org/core/TemplateField",
            "pav:createdOn": "2024-09-13T06:57:55-07:00",
            description: "'Principal_Investigator ORCID Text' field schema generated by the CEDAR Template Editor",
            type: "object",
            title: "'Principal_Investigator ORCID Text' field schema",
            "schema:schemaVersion": "1.6.0",
            "@context": {
              schema: "http://schema.org/",
              pav: "http://purl.org/pav/",
              xsd: "http://www.w3.org/2001/XMLSchema#",
              "pav:createdOn": {
                "@type": "xsd:dateTime",
              },
              skos: "http://www.w3.org/2004/02/skos/core#",
              oslc: "http://open-services.net/ns/core#",
              "skos:altLabel": {
                "@type": "xsd:string",
              },
              "pav:createdBy": {
                "@type": "@id",
              },
              "skos:prefLabel": {
                "@type": "xsd:string",
              },
              "schema:description": {
                "@type": "xsd:string",
              },
              "oslc:modifiedBy": {
                "@type": "@id",
              },
              "pav:lastUpdatedOn": {
                "@type": "xsd:dateTime",
              },
              bibo: "http://purl.org/ontology/bibo/",
              "schema:name": {
                "@type": "xsd:string",
              },
            },
            required: [
              "@value",
            ],
            "schema:identifier": "10624734",
            "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
            "skos:prefLabel": "ORCID",
            _ui: {
              inputType: "textfield",
            },
            _valueConstraints: {
              multipleChoice: false,
              maxLength: 255,
              requiredValue: false,
            },
            "schema:description": "A persistent unique digital identifier assigned to a principal investigator by the Open Researcher and Contributor ID (ORCID) organization.",
            "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
            "pav:lastUpdatedOn": "2024-09-13T06:57:55-07:00",
            "@id": "https://repo.metadatacenter.org/template-fields/86274eaa-cb94-4c68-b5f3-5f4d036a419a",
            additionalProperties: false,
            "schema:name": "Principal_Investigator ORCID Text (10624734)",
            properties: {
              "@type": {
                oneOf: [
                  {
                    format: "uri",
                    type: "string",
                  },
                  {
                    minItems: 1,
                    uniqueItems: true,
                    type: "array",
                    items: {
                      format: "uri",
                      type: "string",
                    },
                  },
                ],
              },
              "@value": {
                type: [
                  "string",
                  "null",
                ],
              },
            },
            $schema: "http://json-schema.org/draft-04/schema#",
            _path: "IJC_PI_contact_info.Principal_Investigator ORCID Text (10624734)",
            _tmp: {
              nested: true,
            },
          },
          "IJC_institution-company": {
            "@id": "https://repo.metadatacenter.org/template-elements/914ece68-45aa-47d0-aa0b-f375ae56fa33",
            "@type": "https://schema.metadatacenter.org/core/TemplateElement",
            "@context": {
              xsd: "http://www.w3.org/2001/XMLSchema#",
              pav: "http://purl.org/pav/",
              bibo: "http://purl.org/ontology/bibo/",
              oslc: "http://open-services.net/ns/core#",
              schema: "http://schema.org/",
              "schema:name": {
                "@type": "xsd:string",
              },
              "schema:description": {
                "@type": "xsd:string",
              },
              "pav:createdOn": {
                "@type": "xsd:dateTime",
              },
              "pav:createdBy": {
                "@type": "@id",
              },
              "pav:lastUpdatedOn": {
                "@type": "xsd:dateTime",
              },
              "oslc:modifiedBy": {
                "@type": "@id",
              },
            },
            type: "object",
            title: "Ijc_institution-company element schema",
            description: "Ijc_institution-company element schema generated by the CEDAR Template Editor 2.6.62",
            _ui: {
              order: [
                "Name",
                "Address",
                "Country Name (3152016)",
              ],
              propertyLabels: {
                "Country Name (3152016)": "Country Name (3152016)",
                Name: "Name",
                Address: "Address",
              },
              propertyDescriptions: {
                "Country Name (3152016)": "Text name for a \"Country\", referring to a wide variety of dependencies, areas of special sovereignty, uninhabited islands, and other entities in addition to the traditional countries or independent states. (from CIA World Factbook 2002: http://www.cia.gov/cia/publications/factbook/docs/notesanddefs.html).",
                Name: "",
                Address: "",
              },
            },
            properties: {
              "@context": {
                type: "object",
                properties: {
                  "Country Name (3152016)": {
                    enum: [
                      "https://schema.metadatacenter.org/properties/a39768dc-6e98-4681-b9a2-ae3090679b33",
                    ],
                  },
                  Name: {
                    enum: [
                      "https://schema.metadatacenter.org/properties/d0398a63-37af-44bb-a1b6-ee37f7ddfc64",
                    ],
                  },
                  Address: {
                    enum: [
                      "https://schema.metadatacenter.org/properties/ee59a0c3-50e4-436a-b543-c760f4fd3261",
                    ],
                  },
                },
                additionalProperties: false,
                required: [
                  "Name",
                  "Address",
                  "Country Name (3152016)",
                ],
              },
              "@id": {
                type: "string",
                format: "uri",
              },
              "@type": {
                oneOf: [
                  {
                    type: "string",
                    format: "uri",
                  },
                  {
                    type: "array",
                    minItems: 1,
                    items: {
                      type: "string",
                      format: "uri",
                    },
                    uniqueItems: true,
                  },
                ],
              },
              "Country Name (3152016)": {
                "bibo:status": "bibo:published",
                "pav:version": "1.0.0",
                "@type": "https://schema.metadatacenter.org/core/TemplateField",
                "pav:createdOn": "2024-09-13T06:53:38-07:00",
                description: "The 'Country Name' field schema auto-generated by the CEDAR/CDE Tool",
                type: "object",
                title: "The 'Country Name' field schema",
                "schema:schemaVersion": "1.6.0",
                "@context": {
                  schema: "http://schema.org/",
                  pav: "http://purl.org/pav/",
                  xsd: "http://www.w3.org/2001/XMLSchema#",
                  "pav:createdOn": {
                    "@type": "xsd:dateTime",
                  },
                  skos: "http://www.w3.org/2004/02/skos/core#",
                  oslc: "http://open-services.net/ns/core#",
                  "skos:altLabel": {
                    "@type": "xsd:string",
                  },
                  "pav:createdBy": {
                    "@type": "@id",
                  },
                  "skos:prefLabel": {
                    "@type": "xsd:string",
                  },
                  "schema:description": {
                    "@type": "xsd:string",
                  },
                  "oslc:modifiedBy": {
                    "@type": "@id",
                  },
                  "pav:lastUpdatedOn": {
                    "@type": "xsd:dateTime",
                  },
                  bibo: "http://purl.org/ontology/bibo/",
                  "schema:name": {
                    "@type": "xsd:string",
                  },
                },
                "schema:identifier": "3152016",
                "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
                "skos:prefLabel": "Country",
                _ui: {
                  inputType: "textfield",
                },
                _valueConstraints: {
                  classes: [
                  ],
                  valueSets: [
                    {
                      name: "Country Name",
                      numTerms: 270,
                      vsCollection: "CADSR-VS",
                      uri: "https://cadsr.nci.nih.gov/metadata/CADSR-VS/VD3151957v1",
                    },
                  ],
                  multipleChoice: false,
                  branches: [
                  ],
                  maxLength: 40,
                  ontologies: [
                  ],
                  requiredValue: false,
                },
                "schema:description": "Text name for a \"Country\", referring to a wide variety of dependencies, areas of special sovereignty, uninhabited islands, and other entities in addition to the traditional countries or independent states. (from CIA World Factbook 2002: http://www.cia.gov/cia/publications/factbook/docs/notesanddefs.html).",
                "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
                "pav:lastUpdatedOn": "2024-09-13T06:53:38-07:00",
                "@id": "https://repo.metadatacenter.org/template-fields/80467df6-0183-48c4-820d-097995df0862",
                additionalProperties: false,
                "schema:name": "Country Name (3152016)",
                properties: {
                  "skos:notation": {
                    type: [
                      "string",
                      "null",
                    ],
                  },
                  "@id": {
                    format: "uri",
                    type: "string",
                  },
                  "rdfs:label": {
                    type: [
                      "string",
                      "null",
                    ],
                  },
                  "@type": {
                    oneOf: [
                      {
                        format: "uri",
                        type: "string",
                      },
                      {
                        minItems: 1,
                        uniqueItems: true,
                        type: "array",
                        items: {
                          format: "uri",
                          type: "string",
                        },
                      },
                    ],
                  },
                },
                $schema: "http://json-schema.org/draft-04/schema#",
                _path: "IJC_PI_contact_info.IJC_institution-company.Country Name (3152016)",
                _tmp: {
                  nested: true,
                },
              },
              Name: {
                "@type": "https://schema.metadatacenter.org/core/TemplateField",
                "@context": {
                  xsd: "http://www.w3.org/2001/XMLSchema#",
                  pav: "http://purl.org/pav/",
                  bibo: "http://purl.org/ontology/bibo/",
                  oslc: "http://open-services.net/ns/core#",
                  schema: "http://schema.org/",
                  skos: "http://www.w3.org/2004/02/skos/core#",
                  "schema:name": {
                    "@type": "xsd:string",
                  },
                  "schema:description": {
                    "@type": "xsd:string",
                  },
                  "skos:prefLabel": {
                    "@type": "xsd:string",
                  },
                  "skos:altLabel": {
                    "@type": "xsd:string",
                  },
                  "pav:createdOn": {
                    "@type": "xsd:dateTime",
                  },
                  "pav:createdBy": {
                    "@type": "@id",
                  },
                  "pav:lastUpdatedOn": {
                    "@type": "xsd:dateTime",
                  },
                  "oslc:modifiedBy": {
                    "@type": "@id",
                  },
                },
                type: "object",
                title: "Name field schema",
                description: "Name field schema generated by the CEDAR Template Editor 2.6.62",
                _ui: {
                  inputType: "textfield",
                },
                _valueConstraints: {
                  requiredValue: false,
                },
                properties: {
                  "@type": {
                    oneOf: [
                      {
                        type: "string",
                        format: "uri",
                      },
                      {
                        type: "array",
                        minItems: 1,
                        items: {
                          type: "string",
                          format: "uri",
                        },
                        uniqueItems: true,
                      },
                    ],
                  },
                  "@value": {
                    type: [
                      "string",
                      "null",
                    ],
                  },
                  "rdfs:label": {
                    type: [
                      "string",
                      "null",
                    ],
                  },
                },
                required: [
                  "@value",
                ],
                "schema:name": "Name",
                "schema:description": "",
                "pav:createdOn": "2024-09-13T06:53:38-07:00",
                "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
                "pav:lastUpdatedOn": "2024-09-13T06:53:38-07:00",
                "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
                "schema:schemaVersion": "1.6.0",
                additionalProperties: false,
                "skos:prefLabel": "Name",
                "@id": "https://repo.metadatacenter.org/template-fields/c4045675-178d-4dc2-b5ba-5c2c3b49a0c4",
                $schema: "http://json-schema.org/draft-04/schema#",
                _path: "IJC_PI_contact_info.IJC_institution-company.Name",
                _tmp: {
                  nested: true,
                },
              },
              Address: {
                "@type": "https://schema.metadatacenter.org/core/TemplateField",
                "@context": {
                  xsd: "http://www.w3.org/2001/XMLSchema#",
                  pav: "http://purl.org/pav/",
                  bibo: "http://purl.org/ontology/bibo/",
                  oslc: "http://open-services.net/ns/core#",
                  schema: "http://schema.org/",
                  skos: "http://www.w3.org/2004/02/skos/core#",
                  "schema:name": {
                    "@type": "xsd:string",
                  },
                  "schema:description": {
                    "@type": "xsd:string",
                  },
                  "skos:prefLabel": {
                    "@type": "xsd:string",
                  },
                  "skos:altLabel": {
                    "@type": "xsd:string",
                  },
                  "pav:createdOn": {
                    "@type": "xsd:dateTime",
                  },
                  "pav:createdBy": {
                    "@type": "@id",
                  },
                  "pav:lastUpdatedOn": {
                    "@type": "xsd:dateTime",
                  },
                  "oslc:modifiedBy": {
                    "@type": "@id",
                  },
                },
                type: "object",
                title: "Address field schema",
                description: "Address field schema generated by the CEDAR Template Editor 2.6.62",
                _ui: {
                  inputType: "textfield",
                },
                _valueConstraints: {
                  requiredValue: false,
                },
                properties: {
                  "@type": {
                    oneOf: [
                      {
                        type: "string",
                        format: "uri",
                      },
                      {
                        type: "array",
                        minItems: 1,
                        items: {
                          type: "string",
                          format: "uri",
                        },
                        uniqueItems: true,
                      },
                    ],
                  },
                  "@value": {
                    type: [
                      "string",
                      "null",
                    ],
                  },
                  "rdfs:label": {
                    type: [
                      "string",
                      "null",
                    ],
                  },
                },
                required: [
                  "@value",
                ],
                "schema:name": "Address",
                "schema:description": "",
                "pav:createdOn": "2024-09-13T06:53:38-07:00",
                "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
                "pav:lastUpdatedOn": "2024-09-13T06:53:38-07:00",
                "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
                "schema:schemaVersion": "1.6.0",
                additionalProperties: false,
                "skos:prefLabel": "Address",
                "@id": "https://repo.metadatacenter.org/template-fields/9eb1175b-4ef6-470c-aff0-93ac7d52312c",
                $schema: "http://json-schema.org/draft-04/schema#",
                _path: "IJC_PI_contact_info.IJC_institution-company.Address",
                _tmp: {
                  nested: true,
                },
              },
            },
            "schema:name": "IJC_institution-company",
            "schema:description": "",
            required: [
              "@context",
              "@id",
              "Name",
              "Address",
              "Country Name (3152016)",
            ],
            "pav:createdOn": "2024-09-13T06:57:55-07:00",
            "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
            "pav:lastUpdatedOn": "2024-09-13T06:57:55-07:00",
            "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
            "schema:schemaVersion": "1.6.0",
            additionalProperties: false,
            "pav:version": "0.0.1",
            "bibo:status": "bibo:draft",
            "skos:prefLabel": "Institution / Company",
            $schema: "http://json-schema.org/draft-04/schema#",
            _tmp: {
              nested: true,
            },
          },
        },
        "schema:name": "IJC_Collaborator_contact_info",
        "schema:description": "",
        required: [
          "@context",
          "@id",
          "Name",
          "Email",
          "Principal_Investigator ORCID Text (10624734)",
          "IJC_institution-company",
        ],
        "pav:createdOn": "2024-11-20T03:41:09-08:00",
        "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
        "pav:lastUpdatedOn": "2024-11-20T03:41:09-08:00",
        "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
        "schema:schemaVersion": "1.6.0",
        additionalProperties: false,
        "pav:version": "0.0.1",
        "bibo:status": "bibo:draft",
        "skos:prefLabel": "Principal_Investigator",
        $schema: "http://json-schema.org/draft-04/schema#",
      },
    },
    required: [
      "@context",
      "@id",
      "schema:isBasedOn",
      "schema:name",
      "schema:description",
      "pav:createdOn",
      "pav:createdBy",
      "pav:lastUpdatedOn",
      "oslc:modifiedBy",
      "Project Name",
      "Consortium",
      "IJC_Collaborator_contact_info",
      "IJC_sample_metadata",
      "IJC_PI_contact_info",
    ],
    "schema:name": "Bio Forms",
    "schema:description": "",
    "pav:createdOn": "2024-09-13T06:51:10-07:00",
    "pav:createdBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
    "pav:lastUpdatedOn": "2024-11-20T03:41:09-08:00",
    "oslc:modifiedBy": "https://metadatacenter.org/users/8f5e33fc-5b8a-40c0-9cb2-5a32e55ea3bb",
    "schema:schemaVersion": "1.6.0",
    additionalProperties: false,
    "pav:version": "0.0.1",
    "bibo:status": "bibo:draft",
    "schema:identifier": "IJC_samples_metadata",
    $schema: "http://json-schema.org/draft-04/schema#",
  },
};

// Mocks
// vi.mock('../../src/formsave/formSave.js', () => ({
//   createFolderIfNotExists: vi.fn(),
//   writeFileAsync: vi.fn(),
//   handleExcelUpload: vi.fn(),
//   getCurrentDateTimeForFilename: vi.fn().mockReturnValue('20231031_1500'),
//   findProjectAndInvestigator: vi.fn().mockReturnValue('project_investigator')
// }));

// Helper functions to create mock request and response objects
const mockReq = (data) => ({
  body: data,
});

const mockRes = () => {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  res.send = vi.fn().mockReturnValue(res);
  return res;
};

// Test suite for formSave
describe('formSave', () => {

  beforeEach(() => {
      vi.clearAllMocks();
  });

  it('returns 400 if jsonData is missing', async () => {
      const req = mockReq(null);
      const res = mockRes();

      await formSave(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid payload' });
  });

  it('creates folder with correct path', async () => {
      const req = mockReq({ data: 'test' });
      const res = mockRes();
      const currentYear = new Date().getFullYear();
      const expectedFolderPath = path.join(JSON_RESPONSES_FOLDER, currentYear.toString());

      await formSave(req, res);

      expect(createFolderIfNotExists).toHaveBeenCalledWith(expectedFolderPath);
  });

  it('saves JSON data to correct file path', async () => {
      const req = mockReq({ data: 'test' });
      const res = mockRes();
      const currentYear = new Date().getFullYear();
      const fileName = '20231031_1500_project_investigator';
      const expectedFilePath = path.join(JSON_RESPONSES_FOLDER, currentYear.toString(), `${fileName}.json`);

      await formSave(req, res);

      expect(writeFileAsync).toHaveBeenCalledWith(expectedFilePath, JSON.stringify(req.body, null, 2), 'utf-8');
  });

  it('returns 500 if JSON file write fails', async () => {
      writeFileAsync.mockRejectedValue(new Error('Write failed'));
      const req = mockReq({ data: 'test' });
      const res = mockRes();

      await formSave(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Failed to save JSON file: Write failed' });
  });

  it('uploads Excel file with correct parameters', async () => {
      const req = mockReq(basicTemplate);
      //const req = mockReq(emptyTemplte);
      const res = mockRes();
      const currentYear = new Date().getFullYear();
      const fileName = '20231031_1500_project_investigator';
      const expectedExcelFilePath = path.join(RESPONSES_FOLDER, currentYear.toString(), `${fileName}.xlsx`);

      await formSave(req, res);

      expect(handleExcelUpload).toHaveBeenCalledWith("your_access_token", expectedExcelFilePath, expect.any(Array));
      expect(res.send).toHaveBeenCalledWith(expect.stringContaining('Excel file'));
  });

  it('returns 500 if Excel file upload fails', async () => {
      handleExcelUpload.mockRejectedValue(new Error('Upload failed'));
      const req = mockReq({ data: 'test' });
      const res = mockRes();

      await formSave(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Failed to save Excel file.');
  });

});