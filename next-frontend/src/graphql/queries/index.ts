export {
    LOGIN_MUTATION,
    GET_CURRENT_USER,
    CREATE_USER_MUTATION
} from './auth'

export {
    GET_CURRENT_COMPANY
} from './company'

export {
    GET_REPORT_BY_YEAR,
    CREATE_REPORT
} from './report'

export  {
    GET_CONTEXT_BY_REPORT,
    CREATE_CONTEXT,
    UPDATE_CONTEXT,
    DELETE_CONTEXT
} from  './context'

export {
    GET_ACTIVITY,
    GET_ACTIVITIES_BY_CONTEXT,
    CREATE_ACTIVITY,
    UPDATE_ACTIVITY,
    DELETE_ACTIVITY,
    GET_ACTIVITIES_LABELS,
} from './activity'

export {
    GET_STAKEHOLDERS_BY_REPORT,
    CREATE_STAKEHOLDER,
    UPDATE_STAKEHOLDER,
    DELETE_STAKEHOLDER
} from './stakeholder'

export {
    GET_TOPICS_BY_STANDARD
} from './topics'

export {
    CREATE_USER_SUBMISSION,
    DELETE_USER_SUBMISSION,
    GET_USER_SUBMISSIONS_BY_REPORT,
    GET_USERS_BY_COMPANY
} from './submission'
