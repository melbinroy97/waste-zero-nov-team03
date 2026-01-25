const Opportunity = require("../models/Opportunity");

const isMatched = async (sender, receiver) => {
  // Determine who is Volunteer and who is NGO
  let volunteer, ngo;

  if (sender.role === 'VOLUNTEER' && receiver.role === 'NGO') {
    volunteer = sender;
    ngo = receiver;
  } else if (sender.role === 'NGO' && receiver.role === 'VOLUNTEER') {
    ngo = sender;
    volunteer = receiver;
  } else {
    // If roles are same (e.g. volunteer to volunteer), checking against opportunities doesn't make sense 
    // unless you want peer messaging. Assuming STRICT Match logic:
    return false;
  }

  // Find opportunities owned by the NGO that match the Volunteer's skills/location
  const opportunities = await Opportunity.find({ 
    NGOID: ngo._id, 
    status: "Open" 
  });

  // Check if ANY of the NGO's opportunities match this volunteer
  const hasMatch = opportunities.some((opp) => {
    // 1. Skill Match: Volunteer must have at least one skill required by the opportunity
    const skillMatch = opp.requiredSkills.some((skill) =>
      volunteer.skills.includes(skill)
    );

    // 2. Location Match: Volunteer location must match Opportunity location
    const locationMatch =
      opp.location.toLowerCase() === volunteer.location.toLowerCase();

    return skillMatch && locationMatch;
  });

  console.log(`[isMatched] Checking ${volunteer.email} vs ${ngo.email} -> Match: ${hasMatch}`);
  return hasMatch;
};

module.exports = isMatched;
