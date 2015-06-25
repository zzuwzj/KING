/*global king */
king.define("DataGrid", [], function () {
    var DataGrid = function (element) {
        this.columns = [];
        this.rows = [];

        element.innerHTML = '<table><thead><tr></tr></thead><tbody></tbody></table>';
		
        this.header = element.firstChild.tHead;
        this.tbody = element.firstChild.tBodies[0];
    }

    return DataGrid;
});