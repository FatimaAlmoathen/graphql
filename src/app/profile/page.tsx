'use client';

import { useEffect, useState } from 'react';
import AuthWrapper from '@/components/AuthWrapper';
import { getCurrentUser } from '@/lib/auth';
import { apolloClient } from '@/lib/apollo-client';
import {  
  GET_USER_BASIC_INFO, 
  GET_USER_GROUPS, 
  GET_USER_EVENTS, 
  GET_USER_TRANSACTIONS, 
  GET_USER_XP,
  GET_PASS_FAIL_RESULTS,
  GET_SKILLS,
  GET_USER_PROGRESS  } from '@/lib/queries';

  interface JwtPayload {
  sub?: string;
  id?: number;
  iat?: number;
  exp?: number;
  login?: string;
  email?: string;
  }

  const PieChart = ( {passed, failed}: {passed: number, failed: number}) =>{
    const total = passed  +failed
    const passedPercentage = (passed/total) * 100;
    const failedPercentage = (failed/total) * 100;

    //SVG dimenstions
    const size = 200;
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
          stroke="#ef4444" // red-500
          strokeWidth="20"
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
          stroke="#10b981" // emerald-500
          strokeWidth="20"
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
          <span>Passed: {passed}</span>
        </div>
        <div className="flex items-center">
          <div className="legend-color failed"></div>
          <span>Failed: {failed}</span>
        </div>
      </div>
    </div>
  );
};

const SkillsBarChart = ({ skills }: { skills: { name: string; amount: number }[] }) => {
  const maxAmount = Math.max(...skills.map(skill => skill.amount), 1);
  
  // Chart dimensions
  const maxBarHeight = 200;
  const barWidth = 40;
  const barSpacing = 50;
  const chartHeight = maxBarHeight + 100;
  const chartWidth = skills.length * (barWidth + barSpacing) + 60;
  const axisOffset = 50;

  const barColor = '#3b82f6';
  const activeBarColor = '#2563eb'; 
  const axisColor = '#d1d5db';
  const labelColor = '#4b5563';
  const whiteColor = '#ffffff';

  return (
    <div className="skills-chart-container">
      <h2 className="skills-chart-title">Skills Overview</h2>
      <div className="skills-chart-wrapper">
        <svg className="skills-chart-svg" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
          {/* Y-axis line */}
          <line
            x1={axisOffset}
            y1={20}
            x2={axisOffset}
            y2={maxBarHeight + 20}
            stroke={axisColor}
            strokeWidth="1.5"
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
                  strokeWidth="1"
                />
                <text
                  x={axisOffset - 10}
                  y={yPos}
                  textAnchor="end"
                  dominantBaseline="middle"
                  style={{ fill: labelColor, fontSize: '12px' }}
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
                {/* Bar with hover effect */}
                <rect
                  x={xPos}
                  y={yPos}
                  width={barWidth}
                  height={barHeight}
                  fill={barColor}
                  rx={4}
                  ry={4}
                  className="skill-bar"
                >
                  <title>
                    {skill.name}: {skill.amount} XP
                  </title>
                </rect>
                
                {/* Skill name */}
                <text
                  x={xPos + barWidth / 2}
                  y={maxBarHeight + 50}
                  textAnchor="middle"
                  style={{ fill: labelColor, fontSize: '12px', fontWeight: '500' }}
                >
                  {skill.name}
                </text>
                
                {/* Amount label inside bar */}
                {barHeight > 40 && (
                  <text
                    x={xPos + barWidth / 2}
                    y={yPos + barHeight / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="skill-amount" 
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
            strokeWidth="1.5"
          />
        </svg>
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

//fetch and display user data from graphql
export default function ProfilePage() {
   const [user, setUser] = useState<JwtPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);

 useEffect(() => {
    console.log('1. Starting profile data fetch process');

    const currentUser: JwtPayload | null = getCurrentUser();
    console.log('2. Current user from getCurrentUser():', currentUser);

    setUser(currentUser); //updates user state
    
    if (currentUser?.id) {
        console.log('3. User ID exists:', currentUser.id);

      // Move the async data fetching inside useEffect
      const fetchData = async () => {
        try {
            console.log('4. Starting to fetch profile data...');

             const excludeAuditorLogin = currentUser?.login || '';
console.log('Excluding auditor login:', excludeAuditorLogin);

 const { data: basicInfo } = await apolloClient.query({ 
      query: GET_USER_BASIC_INFO 
    });

    const startDate = basicInfo?.user?.[0]?.createdAt;
    const cohortName = basicInfo?.user?.[0]?.labels?.[0]?.labelName || 'No cohort';

//multiple graphql queries fired
//used promise.all to execute all quereis at once
          const [
            { data: groupsData },
            { data: eventsData },
            { data: transactionsData },
            { data: xpData },
            { data: passFailData },
            { data: skillsData },
            { data: progressData}
          ] = await Promise.all([
            apolloClient.query({ query: GET_USER_GROUPS }),
            apolloClient.query({ query: GET_USER_EVENTS }),
            apolloClient.query({ query: GET_USER_TRANSACTIONS }),
            apolloClient.query({ query: GET_USER_XP }),
            apolloClient.query({ 
                                 query: GET_PASS_FAIL_RESULTS,
                                    variables: { excludeAuditorLogin }
                                }),
            apolloClient.query({ query: GET_SKILLS }),
            apolloClient.query({
        query: GET_USER_PROGRESS,
        variables: { startDate }
      })
            ]);

console.log('pass/fail Query string:', GET_PASS_FAIL_RESULTS.loc?.source.body);

          setProfileData({
            userData: {
            ...(basicInfo?.user?.[0] || {
            login: '',
            firstName: '',
            lastName: '',
            email: '',
            auditRatio: 0,
            totalUp: 0,
            totalDown: 0,
            groupsByCaptainid: []
        }),
        cohortName
        },
        groups: groupsData?.user?.[0]?.groupsByCaptainid || [],
        events: eventsData?.event_user || [],
        transactions: transactionsData?.transaction || [],
        xp: xpData?.xp_view || [],
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

      fetchData();
    } else {
    console.log('skipped if statement:');
      setLoading(false);
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

  const { userData, groups, events, transactions, xpData, audits } = profileData;

   return (
    <AuthWrapper>
      <div className="profile-container">
        <h1 className="profile-title">Profile Page</h1>
        
        {/* basic user info */}
        <div className="profile-card">
          <h2 className="card-title">User Information</h2>
          <div className="user-info-grid">
            <div>
              <p><strong>Login:</strong> {userData.login}</p>
              <p><strong>Name:</strong> {userData.firstName} {userData.lastName}</p>
              <p><strong>Email:</strong> {userData.email}</p>
              <p><strong>Cohort:</strong> {userData.cohortName}</p>
            </div>
            <div>
              <p><strong>Audit Ratio:</strong> {userData.auditRatio}</p>
              <p><strong>Total Up:</strong> {userData.totalUp}</p>
              <p><strong>Total Down:</strong> {userData.totalDown}</p>
              <p><strong>Start Date:</strong> {new Date(userData.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* groups */}
        {userData?.groupsByCaptainid?.length > 0 && (
          <div className="profile-card">
            <h2 className="card-title">Groups</h2>
            <div className="groups-list">
              {userData.groupsByCaptainid.map((group: any) => (
                <div key={group.id} className="group-item">
                  <p><strong>Campus:</strong> {group.campus}</p>
                  <p><strong>Status:</strong> {group.status}</p>
                  <p><strong>Created:</strong> {new Date(group.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* transactions */}
        {/* {transactions.length > 0 && (
          <div className="profile-card">
            <h2 className="card-title">Recent Transactions</h2>
            <div className="table-container">
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Path</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.slice(0, 5).map((tx: any) => (
                    <tr key={tx.id}> 
                      <td>{tx.type}</td>
                      <td>{tx.amount}</td>
                      <td>{tx.path}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )} */}

        {/* XP */}
        {xpData?.length > 0 && (
          <div className="profile-card">
            <h2 className="card-title">XP Summary</h2>
            <div className="xp-list">
              {xpData.map((xp: any) => (
                <div key={`${xp.userId}-${xp.originEventId}`} className="xp-item">
                  <p><strong>Amount:</strong> {xp.amount}</p>
                  <p><strong>Event ID:</strong> {xp.originEventId}</p>
                  <p><strong>Path:</strong> {xp.path}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {profileData.audits?.length > 0 && (
          <div className="profile-card">
            <h2 className="card-title">Audit Results (Pass/Fail)</h2>
            <PieChart 
              passed={profileData.audits.filter((a: any) => a.closureType === "succeeded").length}
              failed={profileData.audits.filter((a: any) => a.closureType === "failed").length}
            />
          </div>
        )}

        {profileData.skills?.length > 0 && (
          <SkillsBarChart skills={processSkillsData(profileData.skills)} />
        )}

        {profileData.progress?.length > 0 && (
  <div className="profile-card">
    <h2 className="card-title">Program Progress</h2>
    <div className="progress-list">
      {profileData.progress.map((item: any, index: number) => (
        <div key={index} className="progress-item">
          <p><strong>XP:</strong> {item.amount}</p>
          <p><strong>Path:</strong> {item.path}</p>
          <p><strong>Event Date:</strong> {new Date(item.event.createdAt).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  </div>
)}
      </div>
    </AuthWrapper>
  );
}
