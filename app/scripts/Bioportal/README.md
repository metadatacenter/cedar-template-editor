This Bioportal directory exposes and Angular module that is injected as a dependency
on the original Angular app located in the root of the /scripts directory

The original app exposes three endpoints that this module uses:

/bioportal/ontologies
/bioportal/classes
/bioportal/value-sets

Each page is made up of sections headlined by an <h3> with a descriptive title based on the 
api call each section demonstrates. Each section demonstrates a call (or more) based on the tasked items from 
the BioPortalRESTAPI.html document which is also included in the root of this /Bioportal directory.