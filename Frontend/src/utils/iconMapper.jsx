import * as Icons from 'react-icons/hi';

export const getIcon = (iconName, props = {}) => {
  const IconComponent = Icons[iconName] || Icons.HiOutlineTag;
  return <IconComponent {...props} />;
};
