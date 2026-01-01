const Opportunity = require("../models/Opportunity");

const isMatched = async (user1, user2) => {
  const opportunities = await Opportunity.find({ status: "Open" });

  return opportunities.some((opp) => {
    const skillMatch =
      user1.skills.some(skill => opp.requiredSkills.includes(skill)) &&
      user2.skills.some(skill => opp.requiredSkills.includes(skill));

    const locationMatch =
      user1.location.toLowerCase() === opp.location.toLowerCase() &&
      user2.location.toLowerCase() === opp.location.toLowerCase();

    return skillMatch && locationMatch;
  });
};

module.exports = isMatched;
