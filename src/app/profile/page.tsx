'use client';

import { useEffect, useState } from 'react';
import AuthWrapper from '@/components/AuthWrapper';
import { getCurrentUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { logout } from '@/lib/auth';
import { apolloClient } from '@/lib/apollo-client';
import {  
  GET_USER_BASIC_INFO, 
  GET_USER_EVENTS, 
  GET_USER_TRANSACTIONS, 
  GET_USER_XP_SUM,
  GET_USER_XP_DETAILS,
  GET_PASS_FAIL_RESULTS,
  GET_SKILLS,
  GET_USER_PROGRESS,
  GET_USER_MAIN_EVENT_AND_LEVEL  } from '@/lib/queries';

  interface JwtPayload {
  sub?: string;
  id?: number;
  iat?: number;
  exp?: number;
  login?: string;
  email?: string;
  }

interface XPProject {
  name: string;
  path: string;
  amount: number;
  formattedAmount: string;
}

interface XPData {
  totalXP: string;
  projects: XPProject[];
}

 interface Label {
    labelName: string;
  } 

 interface MainEvent {
  level: number;
  eventId: number;
  userId?: number;
  userLogin?: string;
  }
  interface UserData {
  id: number;
  login: string;
  firstName: string;
  lastName: string;
  updatedAt: string;
  auditRatio?: number;
  labels?: Label[];
  cohortName?: string;
  mainEventLevel?: number | string;
  mainEventId?: number;
}
interface Transaction {
  id: number;
  type: string;
  amount: number;
  createdAt: string;
}

interface Audit {
  id: number;
  closureType: string;
  result?: {
    path: string;
  };
}


interface XPDetail {
  path: string;
  amount: number;
}

interface Skill {
  name: string;
  amount: number;
}
interface ProfileData {
  userData: UserData;
  transactions: Transaction[];
  xpSum: number;
  xpDetails: XPDetail[];
  audits: Audit[];
  skills: Transaction[];
  progress: XPDetail[];
}
  const formatXP = (amount: number) => {
    const kb = amount/1000;

    if (kb >=100){
      return Math.round(kb).toString();
    }else if (kb>=10){
      return kb.toFixed(1)
    }else{
      return kb.toFixed(2)
    }
  }

  const getProjectName = (path: string) => {
    const parts = path.split('/')
    return parts[parts.length - 1] || path
  }

  const isValidProjectPath = (path: string): boolean => {
    const pattern = /^\/bahrain\/bh-module\/[^/]+$/;
    return pattern.test(path);
  };

 const processXPData = (xpData: XPDetail[]): XPData => {
  const projects: XPProject[] = [];
  let totalXP = 0;

  xpData.forEach((xp: XPDetail) => {
    const amount = xp.amount || 0;
    totalXP += amount;
    projects.push({
      name: getProjectName(xp.path),
      path: xp.path,
      amount: amount,
      formattedAmount: formatXP(amount)
    });
  });

  return {
    totalXP: formatXP(totalXP),
    projects: projects
  };
};

  const PieChart = ( {passed, failed}: {passed: number, failed: number}) =>{
    const total = passed  +failed
    console.log("passed:", passed, "----failed: ", failed)
    const passedPercentage = (passed/total) * 100;
    const failedPercentage = (failed/total) * 100;

    //SVG dimenstions
    const size = 190;
    const radius = 80;
    const center = size / 2;
    const circum = 2 * Math.PI * radius;

    //calculate
    const passedDashArray = `${(passedPercentage / 100) * circum} ${circum}`;
  const failedDashArray = `${(failedPercentage / 100) * circum} ${circum}`;
const [hovered, setHovered] = useState<'passed' | 'failed' | null>(null);

  return (
     <div className="pie-chart-container">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle (failed) */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#ffa347"
          strokeWidth="25"
          strokeDasharray={failedDashArray}
          strokeDashoffset={circum * 0.25}
           onMouseEnter={() => setHovered('failed')}
  onMouseLeave={() => setHovered(null)}
  opacity={hovered === null || hovered === 'failed' ? 1 : 0.5}
        />
        
        {/* Foreground circle (passed) */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#ff8be4"
          strokeWidth="25"
          strokeDasharray={passedDashArray}
          strokeDashoffset={circum * 0.25 - (failedPercentage / 100) * circum}
           onMouseEnter={() => setHovered('passed')}
  onMouseLeave={() => setHovered(null)}
  opacity={hovered === null || hovered === 'passed' ? 1 : 0.5}
        />
        
        {/* Center text */}
        <text
          x={center}
          y={center}
          textAnchor="middle"
          dominantBaseline="middle"
          className="pie-chart-text"
        >
          {hovered === 'passed' ? `${passed} passed` : 
          hovered === 'failed' ? `${failed} failed` : 
        `${passedPercentage.toFixed(1)}%`}
        </text>
      </svg>
      
      {/* Legend */}
      <div className="pie-chart-legend">
        <div className="legend-item">
          <div className="legend-color passed"></div>
          <span className='passed-txt'>Passed: <p className='passed-nb'>{passed}</p></span>
        </div>
        <div className="flex items-center">
          <div className="legend-color failed"></div>
          <span className='failed-txt'>Failed: <p className='failed-nb'>{failed}</p></span>
        </div>
      </div>
    </div>
  );
};

const SkillsBarChart = ({ skills }: { skills: { name: string; amount: number }[] }) => {
  const maxAmount = Math.max(...skills.map(skill => skill.amount), 1);
  
  // Chart dimensions
  const maxBarHeight = 160;
  const barWidth = 35;
  const barSpacing = 25;
  const chartHeight = maxBarHeight + 50;
  const chartWidth = skills.length * (barWidth + barSpacing) + 60;
  const axisOffset = 30;

    const barColor = '#aa80ffff';
  const activeBarColor = '#ffabebff'; 
  const axisColor = '#3741519f';
  const labelColor = '#ff71deff';
  const whiteColor = '#ffffff';


  return (
    <div className="skills-chart-container">
      <h2 className="skills-chart-title">Skills Overview</h2>
      <div className="skills-chart-wrapper" style={{ overflowX: 'auto' }}>
        <div style={{ minWidth: `${chartWidth}px` }}>
          <svg 
            className="skills-chart-svg" 
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            preserveAspectRatio="xMinYMin meet"
          >
            {/* Y-axis line */}
            <line
              x1={axisOffset}
              y1={20}
              x2={axisOffset}
              y2={maxBarHeight + 20}
              stroke={axisColor}
              strokeWidth="2"
            />
            
            {/* Y-axis ticks and labels */}
            {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
              const yPos = maxBarHeight + 20 - (tick * maxBarHeight);
              const value = Math.round(tick * maxAmount);
              
              return (
                <g key={tick}>
                  <line
                    x1={axisOffset - 5}
                    y1={yPos}
                    x2={axisOffset}
                    y2={yPos}
                    stroke={axisColor}
                    strokeWidth="1.5"
                  />
                  <text
                    x={axisOffset - 10}
                    y={yPos}
                    textAnchor="end"
                    dominantBaseline="middle"
                    style={{ 
                      fill: labelColor, 
                      fontSize: '14px',
                      fontWeight: '500' 
                    }}
                  >
                    {value}
                  </text>
                </g>
              );
            })}
            
            {/* Bars */}
            {skills.map((skill, index) => {
              const barHeight = (skill.amount / maxAmount) * maxBarHeight;
              const xPos = axisOffset + 30 + index * (barWidth + barSpacing);
              const yPos = maxBarHeight + 20 - barHeight;
              
              return (
                <g key={skill.name}>
                  {/* Bar */}
                  <rect
                    x={xPos}
                    y={yPos}
                    width={barWidth}
                    height={barHeight}
                    fill={barColor}
                    rx={6}
                    ry={6}
                    className="skill-bar"
                  >
                    <title>
                      {skill.name}: {skill.amount} XP
                    </title>
                  </rect>
                  
                  {/* Skill name */}
                  <text
                    x={xPos + barWidth / 2}
                    y={maxBarHeight + 40}
                    textAnchor="middle"
                    style={{ 
                      fill: labelColor, 
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                  >
                    {skill.name}
                  </text>
                  
                  {/* Amount label inside bar */}
                  {barHeight > 30 && ( 
                    <text
                      x={xPos + barWidth / 2}
                      y={yPos + barHeight / 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      style={{
                        fill: whiteColor,
                        fontSize: '14px',
                        fontWeight: '600',
                        pointerEvents: 'none'
                      }}
                    >
                      {skill.amount}
                    </text>
                  )}
                </g>
              );
            })}
            
            {/* X-axis line */}
            <line
              x1={axisOffset}
              y1={maxBarHeight + 20}
              x2={chartWidth}
              y2={maxBarHeight + 20}
              stroke={axisColor}
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

const processSkillsData = (transactions: any[]) => {
     const skillMap = new Map<string, number>();
  
  transactions.forEach(transaction => {
    if (transaction.type.startsWith('skill_')) {
      const skillName = transaction.type.replace('skill_', '');
      const currentMax = skillMap.get(skillName) || 0;
      
      // Keep the highest amount for each skill
      if (transaction.amount > currentMax) {
        skillMap.set(skillName, transaction.amount);
      }
    }
  });
  
  // Convert to array and sort by amount (descending)
  return Array.from(skillMap.entries())
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount);
};

const countUniquePassedAudits = (audits: Audit[], startDate: string): number => {
  const uniquePassed = new Set <string>();

  audits.forEach(audit => {

    if (audit.closureType === "succeeded" && audit.result?.path && isValidProjectPath(audit.result.path)){
      uniquePassed.add(audit.result.path)
    }
  })
  return uniquePassed.size;
}


const countUniqueFailedAudits = (audits: Audit[], startDate: string): number => {
  const uniqueFailed = new Set <string>();

  audits.forEach( audit => {
    if (audit.closureType === "failed" && audit.result?.path && isValidProjectPath(audit.result.path)){
      uniqueFailed.add(audit.result.path)
    }
  })
  return uniqueFailed.size;
}

//fetch and display user data from graphql
export default function ProfilePage() {
   const [user, setUser] = useState<JwtPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const router = useRouter();

  const handleLogout = async () => {
    try{
      await logout();
      setUser(null);
      setProfileData(null);
      router.push('/login');
    }catch (error){
      console.error('Logout failed:', error);
    }
  }

 useEffect(() => {

    const currentUser: JwtPayload | null = getCurrentUser();
    if (!currentUser) {
    router.push('/login');
    return;
    }

    setUser(currentUser); //updates user state
    
    if (currentUser?.id) {

      // Move the async data fetching inside useEffect
      const fetchData = async () => {
        try {
          const excludeAuditorLogin = currentUser?.login || '';

          const { data: basicInfo } = await apolloClient.query({ 
           query: GET_USER_BASIC_INFO 
           });


    const startDate = basicInfo?.user?.[0]?.updatedAt;
    const labels = basicInfo?.user?.[0]?.labels || [];
    const cohortName = labels.find((label: Label) => label.labelName.toLowerCase().includes('cohort'))?.labelName || 'No cohort';
    const { data: mainEventData } = await apolloClient.query({
      query: GET_USER_MAIN_EVENT_AND_LEVEL,
      variables: { userId: currentUser.id }
    });

    const mainEvents = mainEventData?.event_user || [];
    
    let mainEvent = null;
    let originEventId = 0;
    
    if (mainEvents.length > 0) {
      // Find event with highest level
      mainEvent = mainEvents.reduce((prev: MainEvent, current: MainEvent) => 
        (current.level > prev.level) ? current : prev
      );
      originEventId = mainEvent.eventId;
    }
//multiple graphql queries fired
//used promise.all to execute all quereis at once
          const [
            { data: transactionsData },
            { data: passFailData },
            { data: skillsData },
            { data: progressData},
            { data: xpSumData },
            { data: xpDetailsData }
          ] = await Promise.all([
            apolloClient.query({ query: GET_USER_TRANSACTIONS }),
            apolloClient.query({ 
                                 query: GET_PASS_FAIL_RESULTS,
                                    variables: { excludeAuditorLogin }
                                }),
            apolloClient.query({ query: GET_SKILLS }),
            apolloClient.query({
        query: GET_USER_PROGRESS,
        variables: { startDate }
                              }),
            apolloClient.query({
                                query: GET_USER_XP_SUM,
                                variables: { userId: currentUser.id }
                              }),
            apolloClient.query({
                                query: GET_USER_XP_DETAILS,
                                variables: { userId: currentUser.id }
                              })
            ]);

          setProfileData({
          userData: {
          ...basicInfo?.user?.[0],
          labels,
          cohortName,
          mainEventLevel: mainEvent?.level || 'Not available',
          mainEventId: originEventId
        },
        transactions: transactionsData?.transaction || [],
        xpSum: xpSumData?.transaction_aggregate?.aggregate?.sum?.amount || 0,
        xpDetails: xpDetailsData?.xp_view || [],
        audits: passFailData?.audit || [],
        skills: skillsData?.transaction || [],
        progress: progressData?.xp_view || []
      });
        } catch (error) {
          console.error('Error fetching profile data:', error);
        } finally {
          setLoading(false);
        }
      };

      if (currentUser?.id) {
    fetchData();
  } else {
    setLoading(false);
  }
}
  }, []);

//   if (!user) {
//     console.log('No user found - redirecting');
//     return null;
//   }

   if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Not authenticated. Please login.</div>;
  }

  if (!profileData) {
    return <div>No profile data available</div>;
  }

  const { userData, transactions, xpSum, audits, progress, skills } = profileData;

const xpDetails = profileData.xpDetails || [];
const totalXP = profileData.xpSum || 0;

const projects: XPProject[] = Array.isArray(xpDetails) 
  ? xpDetails
      .filter(xp => xp.path && xp.amount) // Filter out invalid entries
      .map(xp => ({
        name: getProjectName(xp.path),
        path: xp.path,
        amount: xp.amount || 0,
        formattedAmount: formatXP(xp.amount || 0)
      }))
  : [];

const processedSkills = skills?.length > 0 ? processSkillsData(skills) : [];

   return (
    <AuthWrapper>
      <div className="profile-container">
        
        <div className="logout-container">
          <button 
            onClick={handleLogout}
            className="logout-button"
          >
            Logout
          </button>
        </div>

        <div className="profile-layout">
          {/* Left Column */}
          
          <div className="profile-center">
          <div className="Name"> Welcome, {userData.firstName} {userData.lastName} aka
            <p>
              <strong>{userData.login}</strong></p>
          </div>

                {userData.labels && userData.labels.length > 0 && (
              <div className="labels-section">
              <div className="labels-container">
            {userData.labels?.map((label: Label) => (
              <span key={`${label.labelName}`} className="label-tag">
                {label.labelName}
              </span>
            ))}
          </div>
        </div>
      )}
      </div>
      <div className='profile-side'>
                <div className='outer-level-container'>
                <div className='level-container'>Level
                  <div className='level-nb'><strong>{userData.mainEventLevel}</strong></div>
                </div>
                </div>
                <div className='outer-auditratio-container'>
                <div className='audit-ratio-container'>Audit Ratio
                  <div className='audit-ratio-nb'><strong>{userData.auditRatio?.toFixed(1)}</strong></div>
                </div>
                </div>
                </div>

    <div className='right-content'>
          <div className="profile-top-row">

            {/* XP Summary */}
              <div className="profile-card scrollable-container">
                <h2 className="card-title-xp">Total XP</h2>
                <div className="xp-summary">
                  <div className="xp-total">
                    <h3>{formatXP(totalXP)} kB</h3>
                  </div>
                  
                  <div className="xp-projects">
                    <h4>Projects Breakdown:</h4>
                    <div className="xp-list-container">
                     {projects.length > 0 ? (
    projects.map((project, index) => (
      <div key={`${project.path}-${project.name}-${index}`} className="xp-item">
        <p><strong>Project:</strong> {project.name}</p>
        <p><strong>XP Contribution:</strong> {project.formattedAmount} kB</p>
      </div>
    ))
  ) : (
    <p>No project data available</p>
  )}
                    </div>
                  </div>
                </div>
              </div>

            {/* Pass/Fail Pie Chart */}
            {audits?.length > 0 && (
              <div className="profile-card">
                <h2 className="card-title-ps">Projects Status</h2>
                <PieChart 
                  passed={countUniquePassedAudits(audits, userData.updatedAt)}
                  failed={countUniqueFailedAudits(audits, userData.updatedAt)}
                />
              </div>
            )}

          </div>

          {/* bottom row */}
          <div className="profile-bottom-row">

            {/* Skills Bar Chart */}
            {processedSkills.length > 0 && (
              <div className="profile-card">
                <SkillsBarChart skills={processedSkills} />
              </div>
            )}
          </div>

        </div>

      </div>
      </div>
    </AuthWrapper>
  );
}
