import { SafeParseReturnType } from "zod"

export const parseValidationIssues = (validation:SafeParseReturnType<any, any>) => {
    const issues: { [key: string]: string[] } = {}
    validation.error?.issues.forEach(issue => {
        const field = issue.path[0]
        const message = issue.message

        if (issues[field]) {
            issues[field].push(message)
        } else {
            issues[field] = [message]
        }
    })
    return issues
}