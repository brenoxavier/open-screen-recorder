declare const RECORDER_WINDOW_WEBPACK_ENTRY: string

import '../global.css'
import './page.css'

const backLinkElement = document.querySelector<HTMLLinkElement>('#back');

backLinkElement.setAttribute('href', RECORDER_WINDOW_WEBPACK_ENTRY)