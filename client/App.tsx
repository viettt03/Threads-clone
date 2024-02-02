import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Main from "./Navigations/Main";
import Auth from "./Navigations/Auth";
import { Provider, useDispatch, useSelector } from 'react-redux';
import Store from './redux/Store';
import { getAllUsers, loadUser } from './redux/actions/userAction';
import { Text } from 'react-native';

function App() {

  return (
    <Provider store={Store}>
      <AppStack />
    </Provider>
  );
}

const AppStack = () => {

  const { isAuthenticated, loading } = useSelector((state: any) => state.user)

  // const dispatch = useDispatch()
  React.useEffect(() => {
    Store.dispatch(loadUser())
    Store.dispatch(getAllUsers());

  }, []);


  // console.log('app isthau ', loading);

  return (
    <>
      {
        loading ? (
          <Text className='text-black'>Loading</Text>
        ) : (
          <>{isAuthenticated ?
            (
              <NavigationContainer>
                <Main />
              </NavigationContainer>
            ) : (
              <NavigationContainer>
                <Auth />
              </NavigationContainer>
            )}
          </>
        )
      }
    </>
  );
}

export default App;
