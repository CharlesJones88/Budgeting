import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Budget from './Budget';

import * as am4core from '@amcharts/amcharts4/core';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';

am4core.useTheme(am4themes_animated);

ReactDOM.render(<Budget />, document.getElementById('root'));
