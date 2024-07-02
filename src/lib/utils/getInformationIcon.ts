function getInformationIcon(type: 'hyperlink' | 'image' | 'pdf') {
  switch (type) {
    case 'hyperlink':
      return 'images/icon_hyperlink.svg';
    case 'image':
      return 'images/icon_image.svg';
    case 'pdf':
      return 'images/icon_document.svg';
  }
}

export default getInformationIcon;
