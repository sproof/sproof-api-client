export const constants = {
  'ADD' :                   'NOTIFICATION_ADD',
  'DELETE' :                'NOTIFICATION_DELETE',
};

const initialState = [];

export default function notificationReducer(state = initialState, action) {
  switch (action.type) {
    case constants.ADD:
      return [
        ...state,
        action.data
      ];

    case constants.DELETE:
      return [
        ...state.filter(n => n.id !== action.data.id)
      ];

    default:
      return state;
  }
}



export function addNotification(notificationType, message) {
  let id = Math.random().toString();
  return {
    type: constants.ADD,
    data: {
      id,
      notificationType,
      message
    }
  };
}


export function deleteNotification(id) {

  return {
    type: constants.DELETE,
    data: {
      id
    }
  };
}