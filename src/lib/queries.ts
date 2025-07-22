import { gql } from '@apollo/client';

export const GET_USER_BASIC_INFO = gql`
  query GetUserBasicInfo {
    user {
      auditRatio
      email
      firstName
      lastName
      login
      totalDown
      totalUp
      updatedAt
      labels {
            createdAt
            labelName
    }
    }
  }
`;

export const GET_USER_GROUPS = gql`
  query GetUserGroups {
    user {
      groupsByCaptainid {
        campus
        captainId
        captainLogin
        createdAt
        eventId
        id
        objectId
        path
        status
        updatedAt
      }
    }
  }
`;

export const GET_USER_EVENTS = gql`
  query GetUserEvents {
    event_user(where: { eventId: { _in: [72, 20, 250] } }) {
      level
      userId
      userLogin
      eventId
    }
  }
`;

export const GET_USER_TRANSACTIONS = gql`
  query GetUserTransactions {
    transaction {
      id
      amount
      path
      type
      userLogin
      eventId
    }
  }
`;

export const GET_USER_XP = gql`
  query GetUserXP {
    xp_view(where: { originEventId: { _in: [72] } }, order_by: { amount: asc }) {
      amount
      originEventId
      path
      userId
    }
  }
`;

// combined query, all data at once
export const GET_USER_PROFILE = gql`
  query GetUserProfile {
    user {
      auditRatio
      email
      firstName
      lastName
      login
      totalDown
      totalUp
      groupsByCaptainid {
        campus
        captainId
        captainLogin
        createdAt
        eventId
        id
        objectId
        path
        status
        updatedAt
      }
    }
    event_user(where: { eventId: { _in: [72, 20, 250] } }) {
      level
      userId
      userLogin
      eventId
    }
    transaction {
      amount
      path
      type
      userLogin
      eventId
    }
    xp_view(where: { originEventId: { _in: [72] } }, order_by: { amount: asc }) {
      amount
      originEventId
      path
      userId
    }
  }
`;

export const GET_PASS_FAIL_RESULTS = gql`
  query GetPassFailResults($excludeAuditorLogin: String!) {
    audit(where: { auditorLogin: { _neq: $excludeAuditorLogin } }) {
      attrs
      auditorId
      auditorLogin
      closureMessage
      closureType
      grade
      groupId
      id
    }
  }
`;


export const GET_SKILLS = gql `
query Transaction {
    transaction(where: { type: { _regex: "^skill_.*" } }) {
        amount
        attrs
        eventId
        id
        objectId
        originEventId
        path
        userId
        userLogin
        type
        createdAt
    }
}
`;

export const GET_PROG_START_DATE = gql `
query User {
    user {
        createdAt
        firstName
        id
        lastName
        login
        updatedAt
        labels {
            createdAt
            labelName
        }
    }
}
`
// to get xp only from program start date
export const GET_USER_PROGRESS = gql`
  query GetUserProgress($startDate: timestamptz!) {
    xp_view(where: {event: {createdAt: {_gte: $startDate}}}) {
      amount
      originEventId
      path
      userId
      event {
        createdAt
        endAt
      }
    }
  }
`;