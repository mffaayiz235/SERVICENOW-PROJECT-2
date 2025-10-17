/* 
Business Rule: Prevent User Deletion if Assigned to an Incident
Table: sys_user
When: Before Delete
Active: True
Purpose: Prevents deletion of users who are assigned to open incidents.
*/

(function executeRule(current, previous /*null when async*/) {

    // Initialize GlideRecord to query the Incident table
    var incidentGR = new GlideRecord('incident');
    
    // Query incidents assigned to the user being deleted
    incidentGR.addQuery('assigned_to', current.sys_id);
    incidentGR.addQuery('state', '!=', '7'); // 7 = Closed
    incidentGR.query();

    // If any active incidents exist, prevent deletion
    if (incidentGR.hasNext()) {
        gs.addErrorMessage('Cannot delete user: Active incidents are still assigned to this user.');
        current.setAbortAction(true);
    }

})(current, previous);
