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
      createdAt
      labels {
            createdAt
            labelName
    }
    }
  }
`;

//remove this cus gives all event ids not just main events and i don't need
export const GET_USER_EVENTS = gql`
  query GetUserEvents {
    event_user{
      level
      userId
      userLogin
      eventId
    }
  }
`;

export const GET_USER_MAIN_EVENT_AND_LEVEL= gql`
query GetUserMainEventAndLevel($userId: Int!) {
    event_user(where: { eventId: { _in: [72, 20, 250, 763] } userId: { _eq: $userId } }) {
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

export const GET_USER_XP_SUM = gql`
query GetUserXpSum($userId: Int!) {
  transaction_aggregate(
    where: {
      userId: { _eq: $userId }
      event: { 
        path: { _eq: "/bahrain/bh-module" } 
      }
      type: { _eq: "xp" }
    }
  ) {
    aggregate {
      sum {
        amount
      }
    }
  }
}
`;

export const GET_USER_XP_DETAILS = gql`
   query GetUserXPDetails($userId: Int!) {
    xp_view(
      where: {
        userId: { _eq: $userId }
        path: { _regex: "^/bahrain/bh-module/.+" }
      }
    ) {
      amount
      path
      userId
    }
  }
`
  // query GetUserXP ($originEventId: Int!) {
  //   xp_view(where: { originEventId: {_eq: $originEventId } }, order_by: { amount: asc }) {
  //     amount
  //     originEventId
  //     path
  //     userId
  //     event {
  //       createdAt
  //       endAt
  //     }
  //   }
  // }
//   query GetUserXP {
//   xp_view(
//     where: {
//       _and: [
//         { path: { _regex: "^\\/bahrain\\/bh-module\\/.+" } }
//         { path: { _nregex: "^\\/bahrain\\/bh-module\\/piscine-js\\/" } }
//         { path: {
//             _nregex: "^\\/bahrain\\/bh-module\\/piscine-rust\\/"
//         }

//         }
//       ]
//     }
//   ) {
//     amount
//     path
//     userId
//     event {
//       createdAt
//       endAt
//     }
//     originEventId
//   }
// }
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
    audit(where: { auditorLogin: {  _neq: $excludeAuditorLogin } }) {
        auditorId
        auditorLogin
        closureMessage
        closureType
        grade
        id
        createdAt
        endAt
        closedAt
        auditedAt
        result {
            eventId
            isLast
            path
            updatedAt
        }
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