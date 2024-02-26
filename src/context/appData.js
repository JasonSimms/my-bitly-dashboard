/**
  This file is used for controlling the global states of the components,
  you can customize the states for the different components here.
*/
import { createContext, useContext, useReducer, useMemo } from "react";
// prop-types is a library for typechecking of props
import PropTypes from "prop-types";
// // The app data controler context;
const AppData = createContext(null);

// Setting custom name for the context which is visible on react dev tools
AppData.displayName = "AppDataContext";

// Data Fetching
async function fetchData() {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  const data = await response.json();
  return data;
}

// AppData React reducer
function dataReducer(state, action) {
  switch (action.type) {
    case "DATA": {
      return { ...state, data: action.value };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

// data state
function useAppDataController() {
  const context = useContext(AppData);

  if (!context) {
    throw new Error("useDataController should be used inside the ControllerProvider.");
  }

  return context;
}

// Soft AppData context provider
function AppDataControllerProvider({ children }) {
  const initialState = {
    data: ["some initial data"],
  };

  const [controller, dispatch] = useReducer(dataReducer, initialState);

  const value = useMemo(() => [controller, dispatch], [controller, dispatch]);

  return <AppData.Provider value={value}>{children}</AppData.Provider>;
}

// Typechecking props for the AppDataControllerProvider
AppDataControllerProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Context module functions
const setData = async (dispatch) => {
  console.log("set data called");
  const myData = await fetchData();
  console.log(myData);
  dispatch({ type: "DATA", value: myData });
};

export { AppDataControllerProvider, useAppDataController, setData };
