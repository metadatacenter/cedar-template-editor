window.cedarVersion = "cedarVersionValue";
window.cedarVersionModifier = "cedarVersionModifierValue";
window.cedarSourceCommit = "cedarSourceCommitValue";
window.cedarDevelopmentMode = cedarDevelopmentModeValue;
window.cedarCacheControl = window.cedarVersion + window.cedarVersionModifier +
    (window.cedarSourceCommit ? "-" + window.cedarSourceCommit.substring(0, 12) : "") +
    (window.cedarDevelopmentMode ? "-dev-" + Date.now() : "");
window.versioningEnabled = true;
window.makeOpenEnabled = true;
window.categoryTreeEnabled = true;
window.dataciteEnabled = dataciteEnabledValue;
window.cedarGA4TrackingId = "cedarGA4TrackingIdValue";
