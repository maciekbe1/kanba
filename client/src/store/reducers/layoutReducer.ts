const INITIAL_DATA = {
  tabValue: 0,
  theme: false,
  bar: {
    type: null,
    message: null,
    active: false
  }
};
export default (state: any = INITIAL_DATA, action: any) => {
  switch (action.type) {
    case "DRAWER_TAB_VALUE":
      return {
        ...state,
        tabValue: action.tabValue
      };
    case "SET_THEME":
      return {
        ...state,
        theme: action.theme
      };
    case "BAR":
      return {
        ...state,
        bar: action.bar
      };
    default:
      return state;
  }
};
