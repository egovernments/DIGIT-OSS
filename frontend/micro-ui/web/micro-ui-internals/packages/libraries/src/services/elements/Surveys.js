import Urls from "../atoms/urls";
import { Request } from "../atoms/Utils/Request";

export const Surveys = {
    search: (filters = {}) =>
        Request({
            url: Urls.engagement.surveys.search,
            useCache: false,
            method: "POST",
            auth: true,
            userService: false,
            params: { ...filters },
        }),
    create: (details) =>
        Request({
            url: Urls.engagement.surveys.create,
            data: details,
            useCache: true,
            userService: true,
            method: "POST",
            auth: true,
            locale: true
        }),
    delete: (details) =>
        Request({
            url: Urls.engagement.surveys.delete,
            data: details,
            useCache: true,
            userService: true,
            method: "POST",
            auth: true,
        }),
    update: (details) =>
        Request({
            url: Urls.engagement.surveys.update,
            data: details,
            useCache: true,
            userService: true,
            method: "POST",
            auth: true,
        }),
    submitResponse: (details) =>
        Request({
            url: Urls.engagement.surveys.submitResponse,
            data: details,
            useCache: true,
            userService: true,
            method: "POST",
            auth: true,
        }),
    showResults: (details) =>
        Request({
            url: Urls.engagement.surveys.showResults,
           // data: details,
            useCache: true,
            userService: true,
            method: "POST",
            auth: true,
            params:{surveyId:details.surveyId}
        }),
};
