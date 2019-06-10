import * as React from 'react';
import _ from 'lodash';
import moment from 'moment';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';

import { NewTransactionModal } from '../NewTransactionModal';
import { TransactionList } from '../TransactionList';

import { Transaction } from '../model/Transaction';
import { Category } from '../model/Category';
import { TransactionControl } from '../TransactionControl';

export default class Budget extends React.Component<any> {
  chart: am4charts.PieChart | undefined;
  state: any = {
    open: false,
    transactions: [],
    pageNumber: 1,
    count: 10,
  };

  componentDidMount() {
    this.getCategories().then((categories: Array<Category>) => {
      this.setState({ categories });
      this.chart = am4core.create('categoryBreakdown', am4charts.PieChart);
      this.chart.innerRadius = am4core.percent(40);
      this.chart.data = this.getPieChartData(categories);
      let pieSeries = this.chart.series.push(new am4charts.PieSeries());
      if (pieSeries) {
        pieSeries.dataFields.value = 'amount';
        pieSeries.dataFields.category = 'category';
        pieSeries.labels.template.disabled = true;
        pieSeries.ticks.template.disabled = true;
      }
    });
  }

  componentDidUpdate(_prevProps: any, prevState: any) {
    if (this.chart && this.state.categories !== prevState.categories) {
      this.chart.data = this.getPieChartData(this.state.categories);
    }
  }

  componentWillUnmount() {
    this.chart && this.chart.dispose();
  }

  getCategories = (): Promise<any> =>
    fetch('/api/transactions/categories')
      .then(res => res.json())
      .then(({ data }) => data);

  getTransactions = (): Promise<any> =>
    fetch(`/api/transactions${this.buildQueryParams()}`)
      .then(res => res.json())
      .then(
        ({
          transactions,
          totalPages,
          pageNumber,
          count,
          totalEntries,
        }): void => {
          this.setState({
            transactions,
            totalPages,
            pageNumber,
            count,
            totalEntries,
          });
        },
      );

  buildQueryParams = (): string => {
    const params: any = {
      page: this.state.pageNumber,
      count: this.state.count,
      sortOrder: this.state.sortOrder,
      sortField: this.state.sortField,
      search: this.state.search,
    };
    const queryParams: Array<string> = Object.keys(params)
      .filter(key => params[key])
      .map(key => `${key}=${params[key]}`);

    return queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
  };

  getPieChartData(categories: Array<Category>): Array<any> {
    const categoryValues: Array<string> = _.chain(categories)
      .map('category')
      .uniq()
      .value();

    return categoryValues.map((category: string): any => {
      const amount: number = Math.abs(
        _.chain<Array<Category>>(categories)
          .filter(['category', category])
          .map('amount')
          .sum()
          .value(),
      );

      return {
        category,
        amount,
      };
    });
  }

  setPage = (pageNumber: number) =>
    this.setState({ pageNumber }, this.getTransactions);

  setSizePerPage = (count: number): void =>
    this.setState({ count }, this.getTransactions);

  setSortingOptions = ({ sortOrder, sortField }): void =>
    this.setState({ sortOrder, sortField }, this.getTransactions);

  setSearch = (search: string): void =>
    this.setState({ search }, this.getTransactions);

  handleOpen = (): void => this.setState({ open: true });

  handleClose = (): void => this.setState({ open: false });

  deleteTransactions = (): void => {
    const transactions = [...this.state.transactions];
    const transactionsToDelete = transactions.filter(
      transaction => transaction.checked,
    );
    if (transactionsToDelete.length > 0) {
      const promises: Array<Promise<any>> = transactionsToDelete.map(
        (transaction: Transaction) =>
          fetch(`/api/transactions/${transaction.id}`, { method: 'DELETE' }),
      );
      Promise.all(promises).then(this.getTransactions);
    }
  };

  addTransaction = (transaction: Transaction): void => {
    const { date, ...rest } = transaction;
    fetch('/api/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...rest,
        date: moment(date).format('YYYY-MM-DD'),
      }),
    }).then(this.getTransactions);
  };

  uploadFile = (e: React.FormEvent<any>): void => {
    const files: FileList | null = e.currentTarget.files;
    if (files && files.length) {
      const file: File = files[0];
      const formData: FormData = new FormData();
      formData.append('transaction', file);
      fetch('/api/transactions', { method: 'POST', body: formData }).then(
        this.getTransactions,
      );
    }
  };

  render() {
    return (
      <div>
        <TransactionControl
          handleOpen={this.handleOpen}
          deleteTransactions={this.deleteTransactions}
          uploadFile={this.uploadFile}
        />
        <TransactionList
          transactions={this.state.transactions}
          totalPages={this.state.totalPages}
          pageSize={this.state.count}
          page={this.state.pageNumber}
          setPage={this.setPage}
          setSizePerPage={this.setSizePerPage}
          setSortingOptions={this.setSortingOptions}
          setSearch={this.setSearch}
          totalSize={this.state.totalEntries}
        />
        <div
          id="categoryBreakdown"
          style={{
            display: 'inline-block',
            width: '250px',
            height: '250px',
            verticalAlign: 'top',
          }}
        ></div>
        <NewTransactionModal
          open={this.state.open}
          handleClose={this.handleClose}
          addTransaction={this.addTransaction}
        />
      </div>
    );
  }
}
