import {createAppContainer} from 'react-navigation'
import {createStackNavigator} from 'react-navigation-stack'
import Home from './screens/Home'
import AddContactScreen from './screens/AddContactScreen'
import EditContactScreen from './screens/EditContactScreen'
import ViewContactScreen from './screens/ViewContactScreen'
const MainNavigator = createStackNavigator({
  Home : {screen : Home},
  Add : {screen : AddContactScreen},
  Edit : {screen : EditContactScreen},
  View : {screen : ViewContactScreen}
},
{
  defaultNavigationOptions : {
    headerTintColor : "white",
    headerStyle : {
      backgroundColor : "#b83227"
    },
    headerTitleStyle : {
      color : "white"
    },
    headerTitle : "Home"
  }
})

const App = createAppContainer(MainNavigator)
export default App