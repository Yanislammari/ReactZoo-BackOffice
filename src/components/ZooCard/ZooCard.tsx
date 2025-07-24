import React from 'react';
import Zoo from '../../models/entities/Zoo';
import './ZooCard.css';

interface ZooCardProps {
  zoo: Zoo;
}

const ZooCard: React.FC<ZooCardProps> = ({ zoo }) => {
  return (
    <div className="ZooCard">
      <div className="zoo-image">
        <img src="/assets/ZooIcon.png" alt="Zoo" />
      </div>
      <div className="zoo-name">
        <h3>{zoo.name}</h3>
      </div>
    </div>
  );
}

export default ZooCard;
