import {
    Link,
    IndexLink
} from 'react-router';
import Router from 'modules/Router';
import TestGroup from 'modules/TestGroup';
import probeGroup from 'modules/probe-group';
import FirstTestComponent from 'components/FirstTestComponent';
import ThirdTestContainer from 'containers/ThirdTestContainer';

export default {
    Link,
    IndexLink,
    Router,
    TestGroup,
    "probe-group": probeGroup,
    FirstTestComponent,
    ThirdTestContainer
};
