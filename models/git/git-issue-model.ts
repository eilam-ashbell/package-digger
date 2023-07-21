import OwnerModel from "./owner-model";

export default class GitIssueModel     {
    "url": string;
    "repository_url": string;
    "labels_url": string;
    "comments_url": string;
    "events_url": string;
    "html_url": string;
    "id": number;
    "node_id": string;
    "number": number;
    "title": string;
    "user": OwnerModel;
    "labels": 
        {
            "id": number;
            "node_id": string;
            "url": string;
            "name": string;
            "color": string;
            "default": false,
            "description": string
        }[]
    "state": string;
    "locked": boolean;
    "assignee": OwnerModel;
    "assignees": OwnerModel[];
    "milestone": {
        "url": string;
        "html_url": string;
        "labels_url": string;
        "id": number;
        "node_id": string;
        "number": number;
        "state": string;
        "title": string;
        "description": string;
        "creator": OwnerModel
        "open_issues": number;
        "closed_issues": number;
        "created_at": string;
        "updated_at": string;
        "closed_at": string;
        "due_on": string;
      }
    "comments": number;
    "created_at": string;
    "updated_at": string;
    "closed_at": string;
    "author_association": string;
    "active_lock_reason": string;
    "draft": boolean;
    "pull_request": {
        "url": string;
        "html_url": string;
        "diff_url": string;
        "patch_url": string;
        "merged_at": null
    };
    "body": string;
    "reactions": {
        "url": string;
        "total_count": number;
        "+1": number;
        "-1": number;
        "laugh": number;
        "hooray": number;
        "confused": number;
        "heart": number;
        "rocket": number;
        "eyes": number;
    };
    "timeline_url": string;
    "performed_via_github_app": any;
    "state_reason": any;
}