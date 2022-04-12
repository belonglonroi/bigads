import { environment } from './../../../environments/environment';

export class BaseService {

    get apiUrl() {
        return environment.apiUrl;
    }

    get authUrl() {
        return `${this.apiUrl}/auth`;
    }

    get userUrl() {
        return `${this.apiUrl}/user`;
    }

    get roleUrl() {
        return `${this.apiUrl}/role`;
    }

    get organizationUrl() {
        return `${this.apiUrl}/organization`;
    }

    get userOrganizationUrl() {
        return `${this.apiUrl}/user-organization`;
    }

    get serviceUrl() {
        return `${this.apiUrl}/service`;
    }

    get projectUrl() {
        return `${this.apiUrl}/project`;
    }

    get campaignUrl() {
        return `${this.apiUrl}/campaign`;
    }

    get campaignAdUrl() {
        return `${this.apiUrl}/campaign-ad`;
    }

    get campaignPaymentUrl() {
        return `${this.apiUrl}/campaign-payment`;
    }

    get reportUrl() {
        return `${this.apiUrl}/report`;
    }

    get codeUrl() {
        return `${this.apiUrl}/code`;
    }

    get departmentUrl() {
        return `${this.apiUrl}/department`;
    }

    get categoryUrl() {
        return `${this.apiUrl}/category`;
    }

}
