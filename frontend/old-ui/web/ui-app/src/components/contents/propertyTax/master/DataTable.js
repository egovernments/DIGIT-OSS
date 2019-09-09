import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
const $ = require('jquery');
const dt = require('datatables.net-bs');
const buttons = require('datatables.net-buttons-bs');

require('datatables.net-buttons/js/buttons.colVis.js'); // Column visibility
require('datatables.net-buttons/js/buttons.html5.js'); // HTML 5 file export
require('datatables.net-buttons/js/buttons.flash.js'); // Flash file export
require('datatables.net-buttons/js/buttons.print.js'); // Print view button

let simpleGet = key => data => data[key];
let keyGetter = keys => data => keys.map(key => data[key]);

let isEmpty = value => value == null || value === '';

let getCellValue = ({ prop, defaultContent, render }, row) =>
  // Return `defaultContent` if the value is empty.
  !isEmpty(prop) && isEmpty(row[prop])
    ? defaultContent
    : // Use the render function for the value.
      render
      ? render(row[prop], row)
      : // Otherwise just return the value.
        row[prop];

let getCellClass = ({ prop, className }, row) =>
  !isEmpty(prop) && isEmpty(row[prop]) ? 'empty-cell' : typeof className == 'function' ? className(row[prop], row) : className;

export default class DateTable extends Component {
  constructor(props) {
    super(props);
    console.log('Table constructor', this);
    this._headers = [];
    //  bind event handlers in the constructor so they are only bound once for every instance
  }

  static defaultProps = {
    buildRowOptions: () => ({}),
    sortBy: {},
  };
  static propTypes = {
    keys: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]).isRequired,

    columns: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        prop: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        render: PropTypes.func,
        sortable: PropTypes.bool,
        defaultContent: PropTypes.string,
        width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        className: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
      })
    ).isRequired,

    dataArray: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.array, PropTypes.object])).isRequired,

    buildRowOptions: PropTypes.func,

    sortBy: PropTypes.shape({
      prop: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      order: PropTypes.oneOf(['ascending', 'descending']),
    }),

    onSort: PropTypes.func,
  };

  componentDidMount() {
    console.log('Table componentDidMount', this);

    let table = this.getDTMarkup();
    let dtContainer = this.refs.dtContainer;
    let renderedTable = ReactDOMServer.renderToStaticMarkup(table, dtContainer);

    $('#dtContainer').append(renderedTable);

    let jqueryTable = $('#dt');
    jqueryTable.DataTable({
      // eslint-disable-line new-cap
      dom: '<"html5buttons"B>lTfgitp',
      buttons: ['copy', 'csv', 'excel', 'pdf', 'print'],
      pagingType: 'numbers',
      bAutoWidth: false,
      bDestroy: true,
      fnDrawCallback: function() {
        console.log('datatables fnDrawCallback');
      },
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log('Table shouldComponentUpdate', this);
    console.log('nextProps', nextProps);
    console.log('nextState', nextState);
    // TODO check if dataArray changes, if so implement componentDidMount code in componentWillUpdate
    return false;
  }

  componentWillUnmount() {
    console.log('Table componentWillUnmount', this);
  }

  getDTMarkup() {
    console.log('Table getDTMarkup', this);

    let { columns, keys, buildRowOptions, sortBy, onSort } = this.props;
    let headers = columns.map((col, idx) => {
      return (
        <th
          ref={c => (this._headers[idx] = c)}
          key={idx}
          style={{
            width: col.width,
          }}
          role="columnheader"
          scope="col"
        >
          <span>{col.title}</span>
        </th>
      );
    });

    let getKeys = Array.isArray(keys) ? keyGetter(keys) : simpleGet(keys);
    let rows = this.props.dataArray.map(row => (
      <tr key={getKeys(row)} {...buildRowOptions(row)}>
        {columns.map((col, i) => (
          <td key={i} className={getCellClass(col, row)}>
            {getCellValue(col, row)}
          </td>
        ))}
      </tr>
    ));

    return (
      <table id="dt" {...this.props}>
        <thead>
          <tr>{headers}</tr>
        </thead>
        <tbody>
          {rows.length ? (
            rows
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center">
                No data
              </td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }

  render() {
    console.log('Table render', this);
    return (
      <div>
        <div ref="dtContainer" id="dtContainer" />
      </div>
    );
  }
}
