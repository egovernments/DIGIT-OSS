import React, { Component } from 'react';
const $ = require('jquery');
$.DataTable = require('datatables.net');
const dt = require('datatables.net-bs');

const buttons = require('datatables.net-buttons-bs');

require('datatables.net-buttons/js/buttons.colVis.js'); // Column visibility
require('datatables.net-buttons/js/buttons.html5.js'); // HTML 5 file export
require('datatables.net-buttons/js/buttons.flash.js'); // Flash file export
require('datatables.net-buttons/js/buttons.print.js'); // Print view button

const columns = [
  {
    title: 'Name',
    width: 120,
    data: 'name',
  },
  {
    title: 'Nickname',
    width: 180,
    data: 'nickname',
  },
];

export default class DateTable extends Component {
  componentDidMount() {
    $('#main').DataTable({
      dom: 'Bfrtip',
      buttons: ['copy', 'csv', 'excel', 'pdf', 'print'],
      data: this.props.names,
      columns,
      ordering: false,
    });
  }
  componentWillUnmount() {
    $('#main')
      .DataTable()
      .destroy(true);
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <div>
        <table id="main" />
      </div>
    );
  }
}
