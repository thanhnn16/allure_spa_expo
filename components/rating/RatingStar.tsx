import { View, Image } from 'react-native-ui-lib';

import StarIcon from "@/assets/icons/star.svg";
import BlankStarIcon from "@/assets/icons/blank_star.svg";
import HalfStarIcon from "@/assets/icons/star_half.svg";

interface RatingStarProps {
  rating: number;
}

const RatingStar = ({ rating } : RatingStarProps) => {
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const totalStars = 5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Image width={17} height={17} key={`full-${i}`} source={StarIcon} />);
    }

    if (hasHalfStar) {
      stars.push(<Image width={17} height={17} key="half" source={HalfStarIcon} />);
    }

    const blankStars = totalStars - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < blankStars; i++) {
      stars.push(<Image width={17} height={17} key={`blank-${i}`} source={BlankStarIcon} />);
    }

    return stars;
  };

  return <View row >{renderStars()}</View>;
};

export default RatingStar;