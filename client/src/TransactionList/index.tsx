import * as React from 'react';
import moment from 'moment';

import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
  SizePerPageDropdownStandalone,
} from 'react-bootstrap-table2-paginator';
import { Transaction } from '../model/Transaction';

const { SearchBar } = Search;

const columns = [
  {
    dataField: 'description',
    text: 'Description',
    sort: true,
  },
  {
    dataField: 'category',
    text: 'Category',
    sort: true,
  },
  {
    dataField: 'date',
    text: 'Date',
    sort: true,
    formatter(cell: string) {
      return moment(cell).format('MM-DD-YYYY');
    },
  },
  {
    dataField: 'amount',
    text: 'Amount',
    sort: true,
    formatter(cell: string) {
      return (
        <span style={{ color: parseFloat(cell) < 0 ? 'red' : 'green' }}>
          $ {parseFloat(cell).toFixed(2)}
        </span>
      );
    },
  },
];

const defaultSorted = [
  {
    dataField: 'date',
    order: 'desc',
  },
];

const selectRow = {
  mode: 'checkbox',
  clickToSelect: true,
  onSelect(row: Transaction, isSelect: boolean) {
    row.checked = isSelect;
  },
  onSelectAll(isSelect: boolean, rows: Array<Transaction>) {
    rows.forEach(row => (row.checked = isSelect));
  },
};

export const TransactionList = ({
  transactions,
  totalPages,
  totalSize,
  pageSize,
  page,
  setSizePerPage,
  setPage,
  setSortingOptions,
  setSearch,
}) => {
  const paginationOptions = {
    custom: true,
    page,
    paginationSize: totalPages,
    sizePerPage: pageSize,
    totalSize,
  };

  const handleTableChange = function(type: string, source: any) {
    switch (type) {
      case 'pagination':
        setPage(source.page || 1);
        setSizePerPage(source.sizePerPage);
        break;
      case 'sort':
        setSortingOptions({
          sortOrder: source.sortOrder,
          sortField: source.sortField,
        });
        break;
      case 'search':
        setSearch(source.searchText);
        break;
      default:
        console.log(type);
    }
  };
  return (
    <div style={{ minWidth: '70%', display: 'inline-block' }}>
      <PaginationProvider
        bootstrap4
        pagination={paginationFactory(paginationOptions)}
      >
        {({ paginationProps, paginationTableProps }) => (
          <div>
            <PaginationListStandalone {...paginationProps} />
            <SizePerPageDropdownStandalone {...paginationProps} />
            <ToolkitProvider
              keyField="id"
              data={transactions}
              columns={columns}
              search
            >
              {({ searchProps, baseProps }) => (
                <div>
                  <SearchBar {...searchProps} delay={250} />
                  <hr />
                  <BootstrapTable
                    bootstrap4
                    remote
                    keyField="id"
                    {...baseProps}
                    defaultSorted={defaultSorted}
                    selectRow={selectRow}
                    bordered={false}
                    {...paginationTableProps}
                    onTableChange={handleTableChange}
                    striped
                  />
                </div>
              )}
            </ToolkitProvider>
            <PaginationListStandalone {...paginationProps} />
          </div>
        )}
      </PaginationProvider>
    </div>
  );
};
