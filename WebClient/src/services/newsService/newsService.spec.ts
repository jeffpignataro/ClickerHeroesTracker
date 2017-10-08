import { ReflectiveInjector } from "@angular/core";
import { fakeAsync, tick } from "@angular/core/testing";
import { BaseRequestOptions, ConnectionBackend, Http, RequestOptions } from "@angular/http";
import { Response, ResponseOptions } from "@angular/http";
import { MockBackend, MockConnection } from "@angular/http/testing";
import { AppInsightsService } from "@markpieszak/ng-application-insights";

import { NewsService, ISiteNewsEntryListResponse } from "./newsService";

describe("NewsService", () => {
    let newsService: NewsService;
    let appInsights: AppInsightsService;
    let backend: MockBackend;
    let lastConnection: MockConnection;

    describe("getNews", () => {
        beforeEach(() => {
            appInsights = jasmine.createSpyObj("appInsights", ["trackEvent"]);

            let injector = ReflectiveInjector.resolveAndCreate(
                [
                    { provide: ConnectionBackend, useClass: MockBackend },
                    { provide: RequestOptions, useClass: BaseRequestOptions },
                    Http,
                    NewsService,
                    { provide: AppInsightsService, useValue: appInsights },
                ]);

            newsService = injector.get(NewsService) as NewsService;
            backend = injector.get(ConnectionBackend) as MockBackend;
            backend.connections.subscribe((connection: MockConnection) => lastConnection = connection);
        });

        afterAll(() => {
            lastConnection = null;
            backend.verifyNoPendingRequests();
        });

        it("should make an api call", () => {
            newsService.getNews();
            expect(lastConnection).toBeDefined("no http service connection made");
            expect(lastConnection.request.url).toEqual("/api/news", "url invalid");
        });

        it("should return some news", fakeAsync(() => {
            let response: ISiteNewsEntryListResponse;
            newsService.getNews()
                .then((r: ISiteNewsEntryListResponse) => response = r);

            let expectedResponse: ISiteNewsEntryListResponse = { entries: { someEntry: ["someEntryValue1", "someEntryValue2"] } };
            lastConnection.mockRespond(new Response(new ResponseOptions({ body: JSON.stringify(expectedResponse) })));
            tick();

            expect(response).toEqual(expectedResponse, "should return the expected response");
        }));

        it("should handle errors", fakeAsync(() => {
            let response: ISiteNewsEntryListResponse;
            let error: string;
            newsService.getNews()
                .then((r: ISiteNewsEntryListResponse) => response = r)
                .catch((e: string) => error = e);

            lastConnection.mockError(new Error("someError"));
            tick();

            expect(response).toBeUndefined();
            expect(error).toEqual("someError");
            expect(appInsights.trackEvent).toHaveBeenCalled();
        }));
    });
});
