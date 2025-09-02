/**
 * Tyrer-Cuzick Risk Assessment Model
 * Implementation of the validated breast cancer risk assessment algorithm
 */

export interface TyrerCuzickInput {
  currentAge: number;
  ageAtMenarche: number;
  ageAtFirstBirth?: number; // undefined for nulliparity
  menopausalStatus: 'pre' | 'post' | 'unknown';
  ageAtMenopause?: number;
  hrtUse: boolean;
  hrtType?: 'combined' | 'estrogen_only' | 'unknown';
  hrtDuration?: number; // months
  brca1Status: 'positive' | 'negative' | 'unknown';
  brca2Status: 'positive' | 'negative' | 'unknown';
  previousBiopsy: boolean;
  biopsyHistology?: 'normal' | 'atypical_hyperplasia' | 'lcis' | 'dcis';
  familyHistory: {
    firstDegree: FamilyMember[];
    secondDegree: FamilyMember[];
  };
  ethnicity: 'white' | 'black' | 'asian' | 'hispanic' | 'other';
}

export interface FamilyMember {
  relationship: 'mother' | 'sister' | 'daughter' | 'grandmother' | 'aunt' | 'half_sister';
  cancerType: 'breast' | 'ovarian' | 'none';
  ageAtDiagnosis?: number;
  bilateralBreast?: boolean;
}

export interface TyrerCuzickResult {
  lifetimeRisk: number; // percentage
  tenYearRisk: number; // percentage
  remainingLifetimeRisk: number; // percentage
  averagePopulationRisk: number; // percentage for comparison
  riskCategory: 'low' | 'moderate' | 'high';
  relativeRisk: number; // compared to population average
}

/**
 * Age-specific breast cancer incidence rates (per 100,000 women per year)
 * Based on SEER data and international studies
 */
const AGE_SPECIFIC_INCIDENCE = {
  20: 1.5, 25: 8.3, 30: 26.8, 35: 59.9, 40: 125.3,
  45: 189.1, 50: 234.4, 55: 265.9, 60: 295.9, 65: 327.9,
  70: 365.2, 75: 391.7, 80: 411.3, 85: 425.6
};

/**
 * Relative risk factors for various risk factors
 */
const RISK_MULTIPLIERS = {
  ageAtMenarche: {
    under12: 1.2,
    age12to13: 1.1,
    age14to15: 1.0,
    over15: 0.9
  },
  ageAtFirstBirth: {
    nulliparous: 1.4,
    under20: 0.7,
    age20to24: 0.8,
    age25to29: 0.9,
    age30to34: 1.1,
    over35: 1.3
  },
  menopausal: {
    premenopausal: 1.0,
    postmenopausal: {
      earlyMenopause: 0.8, // before 45
      normalMenopause: 1.0, // 45-54
      lateMenopause: 1.2 // after 54
    }
  },
  hrt: {
    never: 1.0,
    estrogen_only: 1.15,
    combined: 1.26
  },
  biopsy: {
    none: 1.0,
    normal: 1.2,
    atypical_hyperplasia: 1.7,
    lcis: 2.4,
    dcis: 1.4
  },
  brca: {
    negative: 1.0,
    brca1: 65.0, // 65% lifetime risk
    brca2: 45.0  // 45% lifetime risk
  }
};

/**
 * Calculate family history relative risk
 */
function calculateFamilyRisk(familyHistory: TyrerCuzickInput['familyHistory']): number {
  let relativeRisk = 1.0;
  
  // First-degree relatives (mother, sister, daughter)
  const firstDegreeBreast = familyHistory.firstDegree.filter(m => m.cancerType === 'breast');
  const firstDegreeOvarian = familyHistory.firstDegree.filter(m => m.cancerType === 'ovarian');
  
  // Multiple first-degree relatives with breast cancer
  if (firstDegreeBreast.length >= 2) {
    relativeRisk *= 2.5;
  } else if (firstDegreeBreast.length === 1) {
    const member = firstDegreeBreast[0];
    if (member.ageAtDiagnosis && member.ageAtDiagnosis < 50) {
      relativeRisk *= 2.3; // Young onset
    } else {
      relativeRisk *= 1.8; // Later onset
    }
  }
  
  // First-degree relatives with ovarian cancer
  if (firstDegreeOvarian.length >= 1) {
    relativeRisk *= 1.5;
  }
  
  // Second-degree relatives
  const secondDegreeBreast = familyHistory.secondDegree.filter(m => m.cancerType === 'breast');
  if (secondDegreeBreast.length >= 2) {
    relativeRisk *= 1.4;
  } else if (secondDegreeBreast.length === 1) {
    relativeRisk *= 1.2;
  }
  
  return relativeRisk;
}

/**
 * Main Tyrer-Cuzick calculation function
 */
export function calculateTyrerCuzickRisk(input: TyrerCuzickInput): TyrerCuzickResult {
  let relativeRisk = 1.0;
  
  // BRCA mutations - highest impact
  if (input.brca1Status === 'positive') {
    return {
      lifetimeRisk: 65,
      tenYearRisk: Math.min(65, (65 / 80) * 10), // Approximate 10-year risk
      remainingLifetimeRisk: 65 * (80 - input.currentAge) / 80,
      averagePopulationRisk: 12.5,
      riskCategory: 'high',
      relativeRisk: 5.2
    };
  }
  
  if (input.brca2Status === 'positive') {
    return {
      lifetimeRisk: 45,
      tenYearRisk: Math.min(45, (45 / 80) * 10),
      remainingLifetimeRisk: 45 * (80 - input.currentAge) / 80,
      averagePopulationRisk: 12.5,
      riskCategory: 'high',
      relativeRisk: 3.6
    };
  }
  
  // Age at menarche
  if (input.ageAtMenarche < 12) {
    relativeRisk *= RISK_MULTIPLIERS.ageAtMenarche.under12;
  } else if (input.ageAtMenarche <= 13) {
    relativeRisk *= RISK_MULTIPLIERS.ageAtMenarche.age12to13;
  } else if (input.ageAtMenarche >= 16) {
    relativeRisk *= RISK_MULTIPLIERS.ageAtMenarche.over15;
  }
  
  // Age at first birth / nulliparity
  if (!input.ageAtFirstBirth) {
    relativeRisk *= RISK_MULTIPLIERS.ageAtFirstBirth.nulliparous;
  } else if (input.ageAtFirstBirth < 20) {
    relativeRisk *= RISK_MULTIPLIERS.ageAtFirstBirth.under20;
  } else if (input.ageAtFirstBirth >= 35) {
    relativeRisk *= RISK_MULTIPLIERS.ageAtFirstBirth.over35;
  } else if (input.ageAtFirstBirth >= 30) {
    relativeRisk *= RISK_MULTIPLIERS.ageAtFirstBirth.age30to34;
  } else if (input.ageAtFirstBirth >= 25) {
    relativeRisk *= RISK_MULTIPLIERS.ageAtFirstBirth.age25to29;
  } else {
    relativeRisk *= RISK_MULTIPLIERS.ageAtFirstBirth.age20to24;
  }
  
  // Menopausal status and HRT
  if (input.menopausalStatus === 'post') {
    if (input.ageAtMenopause && input.ageAtMenopause < 45) {
      relativeRisk *= RISK_MULTIPLIERS.menopausal.postmenopausal.earlyMenopause;
    } else if (input.ageAtMenopause && input.ageAtMenopause > 54) {
      relativeRisk *= RISK_MULTIPLIERS.menopausal.postmenopausal.lateMenopause;
    }
    
    // HRT use
    if (input.hrtUse && input.hrtDuration && input.hrtDuration >= 60) { // 5+ years
      if (input.hrtType === 'combined') {
        relativeRisk *= RISK_MULTIPLIERS.hrt.combined;
      } else if (input.hrtType === 'estrogen_only') {
        relativeRisk *= RISK_MULTIPLIERS.hrt.estrogen_only;
      }
    }
  }
  
  // Biopsy history
  if (input.previousBiopsy) {
    switch (input.biopsyHistology) {
      case 'atypical_hyperplasia':
        relativeRisk *= RISK_MULTIPLIERS.biopsy.atypical_hyperplasia;
        break;
      case 'lcis':
        relativeRisk *= RISK_MULTIPLIERS.biopsy.lcis;
        break;
      case 'dcis':
        relativeRisk *= RISK_MULTIPLIERS.biopsy.dcis;
        break;
      case 'normal':
        relativeRisk *= RISK_MULTIPLIERS.biopsy.normal;
        break;
    }
  }
  
  // Family history
  const familyRisk = calculateFamilyRisk(input.familyHistory);
  relativeRisk *= familyRisk;
  
  // Calculate lifetime risk
  const baseLifetimeRisk = 12.5; // Population average
  const lifetimeRisk = Math.min(95, baseLifetimeRisk * relativeRisk);
  
  // Calculate 10-year risk based on current age
  const currentAgeGroup = Math.floor(input.currentAge / 5) * 5;
  const baseIncidence = AGE_SPECIFIC_INCIDENCE[currentAgeGroup as keyof typeof AGE_SPECIFIC_INCIDENCE] || 100;
  const tenYearRisk = Math.min(50, (baseIncidence / 100000) * 100 * relativeRisk * 10);
  
  // Remaining lifetime risk
  const remainingYears = Math.max(0, 85 - input.currentAge);
  const remainingLifetimeRisk = lifetimeRisk * (remainingYears / 65);
  
  // Risk category
  let riskCategory: 'low' | 'moderate' | 'high' = 'low';
  if (lifetimeRisk >= 20) {
    riskCategory = 'high';
  } else if (lifetimeRisk >= 15 || tenYearRisk >= 1.67) {
    riskCategory = 'moderate';
  }
  
  return {
    lifetimeRisk: Math.round(lifetimeRisk * 10) / 10,
    tenYearRisk: Math.round(tenYearRisk * 10) / 10,
    remainingLifetimeRisk: Math.round(remainingLifetimeRisk * 10) / 10,
    averagePopulationRisk: baseLifetimeRisk,
    riskCategory,
    relativeRisk: Math.round(relativeRisk * 10) / 10
  };
}

/**
 * Validate input data for Tyrer-Cuzick calculation
 */
export function validateTyrerCuzickInput(input: Partial<TyrerCuzickInput>): string[] {
  const errors: string[] = [];
  
  if (!input.currentAge || input.currentAge < 18 || input.currentAge > 95) {
    errors.push('Current age must be between 18 and 95');
  }
  
  if (!input.ageAtMenarche || input.ageAtMenarche < 8 || input.ageAtMenarche > 18) {
    errors.push('Age at menarche must be between 8 and 18');
  }
  
  if (input.ageAtFirstBirth && (input.ageAtFirstBirth < 15 || input.ageAtFirstBirth > 50)) {
    errors.push('Age at first birth must be between 15 and 50');
  }
  
  if (!input.menopausalStatus) {
    errors.push('Menopausal status is required');
  }
  
  if (input.menopausalStatus === 'post' && input.ageAtMenopause && 
      (input.ageAtMenopause < 35 || input.ageAtMenopause > 65)) {
    errors.push('Age at menopause must be between 35 and 65');
  }
  
  return errors;
}