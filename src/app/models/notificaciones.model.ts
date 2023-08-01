export enum TypeNotifications {
  new_user = 'NEW_USER',
  event    = 'EVENT',
  settings = 'SETTINGS',
  email    = 'EMAIL',
  pay      = 'PAY'
}

export type TypeNotificationsMap = {
  [key in TypeNotifications]: {
    key: TypeNotifications,
    icon: string,
    color: string
  }
}

export const NotificationsType : TypeNotificationsMap = {
  NEW_USER: {
    key: TypeNotifications.new_user,
    icon: 'ti-user',
    color: 'primary'
  },
  EVENT: {
    key: TypeNotifications.event,
    icon: 'ti-calendar',
    color: 'success'
  },
  SETTINGS: {
    key: TypeNotifications.settings,
    icon: 'ti-settings',
    color: 'info'
  },
  EMAIL: {
    key: TypeNotifications.email,
    icon: 'fa fa-link',
    color: 'danger'
  },
  PAY: {
    key: TypeNotifications.pay,
    icon: 'ti-money',
    color: 'warning'
  },
}


