// import {Link, IndexLink} from 'react-router';
// import HomePage from 'containers/HomePage';
//
// export default {
// 	Router: {
// 		Link, IndexLink
// 	},
// 	Custom: {
// 		HomePage
// 	}
// };

import {Link, IndexLink} from 'react-router';
import Button from 'components/Button';
import HomePage from 'containers/HomePage';
import App from 'containers/App';

export default {
	Router: {
		Link, IndexLink
	},
	Embedded: {
		Button: Button.Label, HomePage, App
	}
};
