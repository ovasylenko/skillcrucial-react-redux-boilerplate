import { configure, addDecorator, addParameters } from '@storybook/react'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { withInfo } from '@storybook/addon-info'
import '../client/assets/scss/main.scss'


addDecorator(withInfo)

addParameters({ viewport: { viewports: INITIAL_VIEWPORTS } })

configure(require.context('../stories', true, /\.stories\.js$/), module)
