export default {
  attachmentURLCreator(attachment: any) {
    return attachment.map((item: any) => {
      item.content = URL.createObjectURL(item);
      return item;
    });
  }
};
