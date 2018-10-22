'use strict';

define([
  'angular',
  'json!config/url-service.conf.json'
], function (angular, config) {
  angular.module('cedar.templateEditor.service.urlService', [])
      .service('UrlService', UrlService);

  UrlService.$inject = [];

  function UrlService() {

    var userService = null;
    var terminologyService = null;
    var resourceService = null;
    var valueRecommenderService = null;
    var schemaService = null;
    var groupService = null;
    var submissionService = null;
    var messagingService = null;
    var paging = function(page,size, defaultPage, defaultSize, pageString, sizeString) {
      var p = page > 0 ? page : defaultPage;
      var s = size > 0 ? size : defaultSize;
      return  pageString + '=' + p + '&' + sizeString + '=' + s;
    };

    var service = {
      serviceId: "UrlService"
    };

    service.init = function () {
      userService = config.userRestAPI;
      terminologyService = config.terminologyRestAPI;
      resourceService = config.resourceRestAPI;
      valueRecommenderService = config.valueRecommenderRestAPI;
      schemaService = config.schemaRestAPI;
      groupService = config.groupRestAPI;
      submissionService = config.submissionRestAPI;
      messagingService = config.messagingRestAPI;
    };



    service.base = function () {
      return resourceService;
    };

    service.templates = function () {
      return this.base() + '/templates';
    };

    service.getTemplate = function (id) {
      return this.templates() + '/' + encodeURIComponent(id);
    };

    service.postTemplate = function (folderId) {
      return this.templates() + '?folder_id=' + encodeURIComponent(folderId);
    };

    service.templateElements = function () {
      return this.base() + '/template-elements';
    };

    service.getTemplateElement = function (id) {
      return this.templateElements() + '/' + encodeURIComponent(id);
    };

    service.postTemplateElement = function (folderId) {
      return this.templateElements() + '?folder_id=' + encodeURIComponent(folderId);
    };

    service.templateFields = function () {
      return this.base() + '/template-fields';
    };

    service.getTemplateField = function (id) {
      return this.templateFields() + '/' + encodeURIComponent(id);
    };

    service.postTemplateField = function (folderId) {
      return this.templateFields() + '?folder_id=' + encodeURIComponent(folderId);
    };

    service.templateInstances = function () {
      return this.base() + '/template-instances';
    };

    service.templateInstancesBasedOn = function (query,  size) {
      var url = this.base() + "/search?is_based_on=" + encodeURIComponent(query)
          +  "&page=1&page_size=" + size;
      return url;
    };

    service.getTemplateInstance = function (id) {
      return this.templateInstances() + '/' + encodeURIComponent(id);
    };

    service.postTemplateInstance = function (folderId) {
      return this.templateInstances() + '?folder_id=' + encodeURIComponent(folderId);
    };

    service.users = function () {
      return userService + '/users';
    };

    service.getUser = function (id) {
      return this.users() + '/' + encodeURIComponent(id);
    };

    service.terminology = function () {
      return terminologyService;
    };

    service.controlledTerm = function () {
      return terminologyService + "/bioportal";
    };

    service.valueRecommender = function () {
      return valueRecommenderService;
    };

    service.groupBase = function () {
      return groupService;
    };

    service.messagingBase = function () {
      return messagingService;
    };

    service.getValueRecommendation = function () {
      return this.valueRecommender() + '/recommend';
    };

    service.hasInstances = function (templateId) {
      return this.valueRecommender() + '/has-instances?template_id=' + templateId;
    };

    service.resourceBase = function () {
      return resourceService;
    };

    service.getFolder = function (id) {
      return this.folders() + '/' + encodeURIComponent(id);
    };

    service.folders = function () {
      return this.resourceBase() + "/folders";
    };

    service.search = function () {
      return this.resourceBase() + "/search";
    };

    service.sharedWithMe = function () {
      return this.resourceBase() + "/search?sharing=shared-with-me";
    };

    service.facets = function () {
      return this.resourceBase() + "/facets";
    };

    service.resources = function () {
      return this.resourceBase() + "/resources";
    };

    service.schemaBase = function () {
      return schemaService;
    };

    service.schemaProperties = function () {
      return this.schemaBase() + "/properties";
    };

    service.schemaProperty = function (propertyName) {
      return this.schemaProperties() + "/" + propertyName;
    };

    service.validateResource = function (resourceType) {
      return this.base() + '/command/validate' + '?resource_type=' + encodeURIComponent(resourceType);
    };

    service.copyResourceToFolder = function () {
      return this.resourceBase() + "/command/copy-resource-to-folder";
    };

    service.moveNodeToFolder = function () {
      return this.resourceBase() + "/command/move-node-to-folder";
    };

    service.renameNode = function () {
      return this.resourceBase() + "/command/rename-node";
    };

    service.getUsers = function () {
      return this.resourceBase() + "/users";
    };

    service.getGroups = function () {
      return this.groupBase() + "/groups";
    };

    service.templateFieldPermission = function (id) {
      return this.resourceBase() + '/template-fields/' + encodeURIComponent(id) + "/permissions";
    };

    service.templateElementPermission = function (id) {
      return this.resourceBase() + '/template-elements/' + encodeURIComponent(id) + "/permissions";
    };

    service.templatePermission = function (id) {
      return this.resourceBase() + '/templates/' + encodeURIComponent(id) + "/permissions";
    };

    service.templateInstancePermission = function (id) {
      return this.resourceBase() + '/template-instances/' + encodeURIComponent(id) + "/permissions";
    };

    service.folderPermission = function (id) {
      return this.resourceBase() + '/folders/' + encodeURIComponent(id) + "/permissions";
    };

    service.getGroup = function (id) {
      return this.getGroups() + '/' + encodeURIComponent(id);
    };

    service.getGroupMembers = function (id) {
      return this.getGroups() + '/' + encodeURIComponent(id) + "/users";
    };

    service.messagingSummary = function () {
      return this.messagingBase() + '/summary';
    };

    service.messagingMessages = function () {
      return this.messagingBase() + '/messages';
    };

    service.messagingNotNotifiedMessages = function () {
      return this.messagingMessages() + "?notification_status=notnotified";
    };

    service.messagingPatchMessage = function (id) {
      return this.messagingMessages() + "/" + encodeURIComponent(id);
    };

    service.messagingMarkAllMessagesAsRead = function() {
      return this.messagingBase() + '/command/mark-all-as-read';
    };

    service.immportWorkspaces = function () {
      return submissionService + '/command/immport-workspaces';
    };

    service.lincsValidation = function () {
      return submissionService + '/command/validate-lincs';
    };

    service.biosampleValidation = function () {
      return submissionService + '/command/validate-biosample';
    };

    service.airrSubmission = function () {
      return submissionService + '/command/upload-cairr-to-cedar';
    };

    service.immportSubmission = function () {
      return submissionService + '/command/immport-submit';
    };

    service.lincsSubmission = function () {
      return 'https://httpbin.org/post';
    };

    service.airrValidation = function () {
      return submissionService + '/command/validate-cairr';
    };

    service.getOntologies = function () {
      return this.controlledTerm() + "/ontologies";
    };

    service.getValueSetsCollections = function () {
      return this.controlledTerm() + "/vs-collections";
    };

    service.createValueSet = function () {
      return this.controlledTerm() + '/vs-collections/CEDARVS/value-sets';
    };

    service.getValueSetById = function (vsId) {
      return this.controlledTerm() + '/vs-collections/CEDARVS/value-sets/' + encodeURIComponent(vsId);
    };

    service.getValueSetsCache = function () {
      return this.controlledTerm() + "/value-sets";
    };

    service.getRootClasses = function (ontology) {
      return this.controlledTerm() + "/ontologies/" + ontology + "/classes/roots";
    };

    service.getRootProperties = function (ontology) {
      return this.controlledTerm() + "/ontologies/" + ontology + "/properties/roots";
    };

    service.createClass = function () {
      return this.controlledTerm() + '/ontologies/CEDARPC/classes';
    };

    service.getClassById = function (acronym, classId) {
      return this.controlledTerm() + '/ontologies/' + acronym + '/classes/' + encodeURIComponent(classId);
    };

    service.createValue = function (vsId) {
      return this.controlledTerm() + '/vs-collections/CEDARVS/value-sets/' + encodeURIComponent(vsId) + '/values';
    };

    service.getValueTree = function (vsId, vsCollection) {
      return this.controlledTerm() + '/vs-collections/' + vsCollection + '/values/' + encodeURIComponent(vsId)
          + "/tree";
    };

    service.getValueSetTree = function (valueId, vsCollection) {
      return this.controlledTerm() + '/vs-collections/' + vsCollection + '/value-sets/' + encodeURIComponent(valueId)
          + "/tree";
    };

    service.getAllValuesInValueSetByValue = function (valueId, vsCollection, page, size) {
      return this.controlledTerm() + '/vs-collections/' + vsCollection + '/values/' + encodeURIComponent(valueId)
          + "/all-values?" + paging(page,size,1,50,'page','page_size');
    };

    service.getClassChildren = function (acronym, classId, page, size) {
      return this.controlledTerm() + '/ontologies/' + acronym + '/classes/' + encodeURIComponent(classId)
          + "/children?" + paging(page,size,1,1000,'page','pageSize');
    };

    service.getClassDescendants = function (acronym, classId, page, size) {
      return this.controlledTerm() + '/ontologies/' + acronym + '/classes/' + encodeURIComponent(classId)
          + "/descendants?"  + paging(page,size,1,1000,'page','pageSize');
    };

    service.getClassById = function (acronym, classId) {
      return this.controlledTerm() + '/ontologies/' + acronym + '/classes/' + encodeURIComponent(classId);
    };

    service.getPropertyChildren = function (acronym, propertyId) {
      return this.controlledTerm() + '/ontologies/' + acronym + '/properties/' + encodeURIComponent(propertyId)
          + "/children";
    };

    service.getPropertyById = function (acronym, propertyId) {
      return this.controlledTerm() + '/ontologies/' + acronym + '/properties/' + encodeURIComponent(propertyId);
    };

    service.getValueTermById = function (acronym, valueSetId, valueId) {
      return this.controlledTerm() + '/vs-collections/' + acronym  + '/values/' + encodeURIComponent(valueId);
    };

    service.getValueById = function (acronym,  valueId) {
      return this.controlledTerm() + '/vs-collections/' + acronym  + '/values/' + encodeURIComponent(valueId);
    };

    service.getClassParents = function (acronym, classId) {
      return this.controlledTerm() + '/ontologies/' + acronym + '/classes/' + encodeURIComponent(classId)
          + '/parents?include=hasChildren,prefLabel';
    };

    service.getClassTree = function (acronym, classId) {
      return this.controlledTerm() + '/ontologies/' + acronym + '/classes/' + encodeURIComponent(classId) + '/tree';
    };

    service.getPropertyTree = function (acronym, propertyId) {
      return this.controlledTerm() + '/ontologies/' + acronym + '/properties/' + encodeURIComponent(
          propertyId) + '/tree';
    };

    service.getValuesInValueSet = function (vsCollection, vsId, page, size) {
      return this.controlledTerm() + '/vs-collections/' + vsCollection + '/value-sets/' + encodeURIComponent(vsId)
          + "/values?"  + paging(page,size,1,50,'page','pageSize');
    };

    service.searchClasses = function (query, sources, size, page) {
      var url = this.controlledTerm() + "/search?q=" + encodeURIComponent(query)
          + "&scope=classes&" +  paging(page,size,1,1000,'page','page_size');
      if (sources) {
        url += "&sources=" + sources;
      }
      return url;
    };

    service.searchProperties = function (query, sources, size, page) {
      var url = this.controlledTerm() + "/property_search?q=" + encodeURIComponent(query)
          + "&" + paging(page,size,1, 50,'page','pageSize');
      if (sources) {
        url += "&sources=" + sources;
      }
      return url;
    };

    service.searchClassesAndValues = function (query, sources, size, page) {
      var url = this.controlledTerm() + "/search?q=" + encodeURIComponent(query)
          + "&scope=classes,values&" + paging(page,size,1, 50,'page','page_size');
      if (sources) {
        url += "&sources=" + sources;
      }
      return url;
    };

    service.searchClassesValueSetsAndValues = function (query, sources, size, page) {
      var url = this.controlledTerm() + "/search?q=" + encodeURIComponent(query) +
          "&scope=all&"  + paging(page, size, 1, 50,'page','page_size');
      if (sources) {
        url += "&sources=" + sources;
      }
      return url;
    };

    service.searchValueSetsAndValues = function (query, sources, size, page) {
      var url = this.controlledTerm() + "/search?q=" + encodeURIComponent(query) +
          "&scope=value_sets,values&" + paging(page, size, 1, 50,'page','page_size');
      if (sources) {
        url += "&sources=" + sources;
      }
      return url;
    };

    service.searchValueSets = function (query, sources, size, page) {
      var url = this.controlledTerm() + "/search?q=" + encodeURIComponent(query) +
          "&scope=value_sets&" +  paging(page, size, 1, 50,'page','page_size');
      if (sources) {
        url += "&sources=" + sources;
      }
      return url;
    };

    service.autocompleteOntology = function (query, acronym, page, size) {
      var url = this.controlledTerm();
      if (query == '*') {
        url += "/ontologies/" + acronym + "/classes?" + paging(page, size, 1, 500,'page','page_size');
      } else {
        url += "/search?q=" + encodeURIComponent(query) +
            "&scope=classes&sources=" + acronym + "&suggest=true&" + paging(page, size, 1, 500,'page','page_size');
      }
      return url;
    };

    service.autocompleteOntologySubtree = function (query, acronym, subtree_root_id, max_depth, page, size) {
      var url = this.controlledTerm();

      if (query == '*') {
        url += '/ontologies/' + acronym + '/classes/' + encodeURIComponent(subtree_root_id)
            + '/descendants?' + paging(page, size, 1, 500,'page','page_size');
      } else {
        url += '/search?q=' + encodeURIComponent(query) + '&scope=classes' + '&source=' + acronym +
            '&subtree_root_id=' + encodeURIComponent(subtree_root_id) + '&max_depth=' + max_depth +
            "&suggest=true&" + paging(page, size, 1, 500,'page','page_size');
      }
      return url;
    };

    service.publishResource = function () {
      return this.resourceBase() + "/command/publish-resource";
    };

    service.createDraftResource = function () {
      return this.resourceBase() + "/command/create-draft-resource";
    };

    return service;
  }

});
