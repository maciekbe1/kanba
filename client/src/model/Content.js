export default class Content {
  constructor(
    userID,
    attachments,
    cardID,
    cardTitle,
    description,
    date,
    labels,
    priority,
    status,
    title
  ) {
    this.userID = userID;
    this.attachments = attachments;
    this.cardID = cardID;
    this.cardTitle = cardTitle;
    this.description = description;
    this.date = date;
    this.labels = labels;
    this.priority = priority;
    this.status = status;
    this.title = title;
  }
}
