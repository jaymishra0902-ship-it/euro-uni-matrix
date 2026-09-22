import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { BridgeCourse, GradeConversion, GradeConversionInput, HealthStatus, ListBridgeCoursesParams, ListUniversitiesParams, MatchResponse, PlannerWorkspace, PlannerWorkspaceInput, StudentProfileInput, University } from './api.schemas';
import { customFetch } from '../custom-fetch';
import type { ErrorType, BodyType } from '../custom-fetch';
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
export declare const getHealthCheckUrl: () => string;
/**
 * Returns server health status
 * @summary Health check
 */
export declare const healthCheck: (options?: Parameters<typeof customFetch>[1]) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getListUniversitiesUrl: (params?: ListUniversitiesParams) => string;
/**
 * Returns a filterable catalog of universities with admissions fit signals.
 * @summary List European universities
 */
export declare const listUniversities: (params?: ListUniversitiesParams, options?: Parameters<typeof customFetch>[1]) => Promise<University[]>;
export declare const getListUniversitiesQueryKey: (params?: ListUniversitiesParams) => readonly ["/api/universities", ...ListUniversitiesParams[]];
export declare const getListUniversitiesQueryOptions: <TData = Awaited<ReturnType<typeof listUniversities>>, TError = ErrorType<unknown>>(params?: ListUniversitiesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listUniversities>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listUniversities>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListUniversitiesQueryResult = NonNullable<Awaited<ReturnType<typeof listUniversities>>>;
export type ListUniversitiesQueryError = ErrorType<unknown>;
/**
 * @summary List European universities
 */
export declare function useListUniversities<TData = Awaited<ReturnType<typeof listUniversities>>, TError = ErrorType<unknown>>(params?: ListUniversitiesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listUniversities>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetUniversityUrl: (universityId: string) => string;
/**
 * @summary Get a university profile
 */
export declare const getUniversity: (universityId: string, options?: Parameters<typeof customFetch>[1]) => Promise<University>;
export declare const getGetUniversityQueryKey: (universityId: string) => readonly [`/api/universities/${string}`];
export declare const getGetUniversityQueryOptions: <TData = Awaited<ReturnType<typeof getUniversity>>, TError = ErrorType<void>>(universityId: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getUniversity>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getUniversity>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetUniversityQueryResult = NonNullable<Awaited<ReturnType<typeof getUniversity>>>;
export type GetUniversityQueryError = ErrorType<void>;
/**
 * @summary Get a university profile
 */
export declare function useGetUniversity<TData = Awaited<ReturnType<typeof getUniversity>>, TError = ErrorType<void>>(universityId: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getUniversity>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getMatchUniversitiesUrl: () => string;
/**
 * @summary Match a student profile to universities
 */
export declare const matchUniversities: (studentProfileInput: StudentProfileInput, options?: Parameters<typeof customFetch>[1]) => Promise<MatchResponse>;
export declare const getMatchUniversitiesMutationKey: () => readonly ["matchUniversities"];
export declare const getMatchUniversitiesMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof matchUniversities>>, TError, MatchUniversitiesMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof matchUniversities>>, TError, MatchUniversitiesMutationVariables, TContext>;
export type MatchUniversitiesMutationResult = NonNullable<Awaited<ReturnType<typeof matchUniversities>>>;
export type MatchUniversitiesMutationBody = BodyType<StudentProfileInput>;
export type MatchUniversitiesMutationError = ErrorType<unknown>;
export type MatchUniversitiesMutationVariables = {
    data: BodyType<StudentProfileInput>;
};
/**
* @summary Match a student profile to universities
*/
export declare const useMatchUniversities: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof matchUniversities>>, TError, MatchUniversitiesMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof matchUniversities>>, TError, MatchUniversitiesMutationVariables, TContext>;
export declare const getConvertGradeUrl: () => string;
/**
 * @summary Convert a grade between common European and global systems
 */
export declare const convertGrade: (gradeConversionInput: GradeConversionInput, options?: Parameters<typeof customFetch>[1]) => Promise<GradeConversion>;
export declare const getConvertGradeMutationKey: () => readonly ["convertGrade"];
export declare const getConvertGradeMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof convertGrade>>, TError, ConvertGradeMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof convertGrade>>, TError, ConvertGradeMutationVariables, TContext>;
export type ConvertGradeMutationResult = NonNullable<Awaited<ReturnType<typeof convertGrade>>>;
export type ConvertGradeMutationBody = BodyType<GradeConversionInput>;
export type ConvertGradeMutationError = ErrorType<unknown>;
export type ConvertGradeMutationVariables = {
    data: BodyType<GradeConversionInput>;
};
/**
* @summary Convert a grade between common European and global systems
*/
export declare const useConvertGrade: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof convertGrade>>, TError, ConvertGradeMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof convertGrade>>, TError, ConvertGradeMutationVariables, TContext>;
export declare const getListBridgeCoursesUrl: (params?: ListBridgeCoursesParams) => string;
/**
 * @summary List prerequisite bridge courses
 */
export declare const listBridgeCourses: (params?: ListBridgeCoursesParams, options?: Parameters<typeof customFetch>[1]) => Promise<BridgeCourse[]>;
export declare const getListBridgeCoursesQueryKey: (params?: ListBridgeCoursesParams) => readonly ["/api/counselor/bridge-courses", ...ListBridgeCoursesParams[]];
export declare const getListBridgeCoursesQueryOptions: <TData = Awaited<ReturnType<typeof listBridgeCourses>>, TError = ErrorType<unknown>>(params?: ListBridgeCoursesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listBridgeCourses>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listBridgeCourses>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListBridgeCoursesQueryResult = NonNullable<Awaited<ReturnType<typeof listBridgeCourses>>>;
export type ListBridgeCoursesQueryError = ErrorType<unknown>;
/**
 * @summary List prerequisite bridge courses
 */
export declare function useListBridgeCourses<TData = Awaited<ReturnType<typeof listBridgeCourses>>, TError = ErrorType<unknown>>(params?: ListBridgeCoursesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listBridgeCourses>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetPlannerWorkspaceUrl: () => string;
/**
 * @summary Get the signed-in applicant's planner workspace
 */
export declare const getPlannerWorkspace: (options?: Parameters<typeof customFetch>[1]) => Promise<PlannerWorkspace>;
export declare const getGetPlannerWorkspaceQueryKey: () => readonly ["/api/workspace"];
export declare const getGetPlannerWorkspaceQueryOptions: <TData = Awaited<ReturnType<typeof getPlannerWorkspace>>, TError = ErrorType<void>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPlannerWorkspace>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getPlannerWorkspace>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetPlannerWorkspaceQueryResult = NonNullable<Awaited<ReturnType<typeof getPlannerWorkspace>>>;
export type GetPlannerWorkspaceQueryError = ErrorType<void>;
/**
 * @summary Get the signed-in applicant's planner workspace
 */
export declare function useGetPlannerWorkspace<TData = Awaited<ReturnType<typeof getPlannerWorkspace>>, TError = ErrorType<void>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPlannerWorkspace>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getSavePlannerWorkspaceUrl: () => string;
/**
 * @summary Save the signed-in applicant's planner workspace
 */
export declare const savePlannerWorkspace: (plannerWorkspaceInput: PlannerWorkspaceInput, options?: Parameters<typeof customFetch>[1]) => Promise<PlannerWorkspace>;
export declare const getSavePlannerWorkspaceMutationKey: () => readonly ["savePlannerWorkspace"];
export declare const getSavePlannerWorkspaceMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof savePlannerWorkspace>>, TError, SavePlannerWorkspaceMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof savePlannerWorkspace>>, TError, SavePlannerWorkspaceMutationVariables, TContext>;
export type SavePlannerWorkspaceMutationResult = NonNullable<Awaited<ReturnType<typeof savePlannerWorkspace>>>;
export type SavePlannerWorkspaceMutationBody = BodyType<PlannerWorkspaceInput>;
export type SavePlannerWorkspaceMutationError = ErrorType<void>;
export type SavePlannerWorkspaceMutationVariables = {
    data: BodyType<PlannerWorkspaceInput>;
};
/**
* @summary Save the signed-in applicant's planner workspace
*/
export declare const useSavePlannerWorkspace: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof savePlannerWorkspace>>, TError, SavePlannerWorkspaceMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof savePlannerWorkspace>>, TError, SavePlannerWorkspaceMutationVariables, TContext>;
export {};
//# sourceMappingURL=api.d.ts.map