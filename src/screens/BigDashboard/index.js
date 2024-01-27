import React, { useEffect, useState } from 'react';
import TeamWork from 'screens/TeamWork/TeamWork';
import styles from './BigDashboard.module.css';
import { TopStatistics } from './TopStatistics';
import ProjectsColumn from './ProjectsColumn';
import ActivitiesColumn from './ActivitiesColumn';
import moment from 'moment';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

const BigDashboard = ({ selectedProject, setSelectedProject, timer }) => {
	useEffect(() => {
		getTeamWorkData();
		setInterval(async () => getTeamWorkData(), 120000);
	}, []);

	const [totalTickets, setTotalTickets] = useState(0);
	const [completedTask, setCompletedTask] = useState(0);

	const localStorageData = localStorage.getItem('redwing_data');

	const [allusers, setAllUsers] = useState(
		localStorage.getItem('redwing_data') ? JSON.parse(localStorageData) : {}
	);

	const [data, setData] = useState(
		localStorage.getItem('redwing_data') ? JSON.parse(localStorageData) : {}
	);
	const [projectData, setProjectData] = useState(
		localStorage.getItem('redwing_data') ? JSON.parse(localStorageData).projects : []
	);

	const scrollTop = () => {
		window.scrollTo({ top: 0, behaviour: 'smooth' });
	};

	useEffect(() => {
		if (allusers.users) {
			const teamMembers = allusers.users.filter(user => user.user_id !== 33629907);
			const totalTasks = teamMembers.reduce((acc, user) => {
				return acc + user.tasks_count;
			}, 0);
			if (totalTasks !== totalTickets) {
				setTotalTickets(totalTasks);
				setTopStatisticsCount(prev => {
					return {
						...prev,
						teamLoad: totalTasks
					};
				});
			}
		}
	}, [allusers]);

	useEffect(() => {
		if (allusers.users) {
			const teamMembers = allusers.users.filter(user => user.user_id !== 33629907);
			const totalCompleteTask = teamMembers.reduce((acc, user) => {
				return acc + user.completed_todo;
			}, 0);
			if (totalCompleteTask !== completedTask) {
				setCompletedTask(totalCompleteTask);
				setTopStatisticsCount(prev => {
					return {
						...prev,
						taskCompleted: completedTask
					};
				});
			}
		}
	}, [allusers]);

	const getTeamWorkData = () => {
		// setLoading(true);
		axios
			.get(`${process.env.REACT_APP_API_URL}/pages/team_work.php`, {
				headers: {
					// Authorization: `Bearer ${token}`,
					'Access-Control-Allow-Origin': '*'
				}
			})
			.then(res => {
				// console.log(res.data);
				localStorage.setItem('redwing_data', JSON.stringify(res.data));
				setData(res.data);
				setAllUsers(res.data);
				setProjectData(res.data.projects);
				// setLoading(false);
			})
			.catch(error => {
				console.error(error);
				// setLoading(false);
			});
	};

	useEffect(() => {
		setTopStatisticsCount(() => {
			return {
				...topStatisticsCount,
				tasksToday: data.tickets_created_today
			};
		});
	}, [data]);

	const [topStatisticsCount, setTopStatisticsCount] = useState({
		hoursOfWeek: 0,
		completion: 0,
		worthOrders: '$0',
		tasksToday: data.tickets_created_today,
		teamLoad: totalTickets,
		taskCompleted: completedTask
	});
	useEffect(() => {
		// console.log(timer);
		setTopStatisticsCount(prev => {
			return {
				...prev,
				hoursOfWeek: timer.day,
				completion: moment().add(timer.day, 'hours').format('hh:mm')
			};
		});
	}, [timer]);
	// ---------------------- For Expand ---------------------------
	const [expandmem, setExpandmem] = useState(false);
	const [expandact, setExpandact] = useState(false);
	const [expandprj, setExpandprj] = useState(false);
	return (
		<div
			className={styles.bigdashboard}
			style={{
				gridTemplateColumns: `${
					expandmem
						? '0fr 1fr 0fr'
						: expandact
						? `1fr 0fr 0fr`
						: expandprj
						? `0fr 0fr 1fr`
						: topStatisticsCount.hoursOfWeek !== 0
						? '1fr 2.5fr 1.5fr'
						: `0fr 2fr 1fr`
				}`,
				position: 'relative'
			}}
		>
			<Helmet>
				<meta name='apple-mobile-web-app-capable' content='yes' />
			</Helmet>

			<div
				className={styles.activity}
				style={{ display: `${topStatisticsCount.hoursOfWeek === 0 ? 'none' : 'block'}` }}
			>
				<div className={styles.outertopStatisticsBar} style={{ position: 'relative' }}>
					<div className={styles.topStatisticsBar}>
						<TopStatistics text={'Hours of work'} count={topStatisticsCount.hoursOfWeek} />
						<TopStatistics text={'Completion'} count={topStatisticsCount.completion} />
					</div>
					<button
						className={styles.expand}
						onClick={() => {
							setExpandact(true);
						}}
						style={{
							display: `${expandact ? 'none' : 'flex'}`,
							position: 'absolute',
							right: '20px'
						}}
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							stroke-width='1.5'
							stroke='currentColor'
							class='w-6 h-6'
							style={{ width: '25px', color: 'white' }}
						>
							<path
								stroke-linecap='round'
								stroke-linejoin='round'
								d='M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15'
							/>
						</svg>
					</button>
					<button
						className={styles.expand}
						style={{
							display: `${expandact ? 'flex' : 'none'}`,
							position: 'absolute',
							right: '20px'
						}}
						onClick={() => {
							setExpandact(false);
						}}
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							stroke-width='1.5'
							stroke='currentColor'
							class='w-6 h-6'
							style={{ width: '25px', color: 'white' }}
						>
							<path
								stroke-linecap='round'
								stroke-linejoin='round'
								d='M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
							/>
						</svg>
						Minimize
					</button>
				</div>
				<div className={styles.alignActivitiesContent}>
					<ActivitiesColumn
						setTopStatisticsCount={setTopStatisticsCount}
						setSelectedProject={setSelectedProject}
						selectedProject={selectedProject}
					/>
				</div>
			</div>

			<div className={styles.project}>
				<div className={styles.outertopStatisticsBar} style={{ position: 'relative' }}>
					<div className={styles.topStatisticsBar}>
						<TopStatistics text={'Worth Orders'} count={topStatisticsCount.worthOrders} />
					</div>
					<button
						className={styles.expand}
						onClick={() => {
							setExpandprj(true);
						}}
						style={{
							display: `${expandprj ? 'none' : 'flex'}`,
							position: 'absolute',
							right: '50px'
						}}
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							stroke-width='1.5'
							stroke='currentColor'
							class='w-6 h-6'
							style={{ width: '25px', color: 'white' }}
						>
							<path
								stroke-linecap='round'
								stroke-linejoin='round'
								d='M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15'
							/>
						</svg>
						Expand
					</button>
					<button
						className={styles.expand}
						style={{
							display: `${expandprj ? 'flex' : 'none'}`,
							position: 'absolute',
							right: '50px'
						}}
						onClick={() => {
							setExpandprj(false);
						}}
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							stroke-width='1.5'
							stroke='currentColor'
							class='w-6 h-6'
							style={{ width: '25px', color: 'white' }}
						>
							<path
								stroke-linecap='round'
								stroke-linejoin='round'
								d='M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
							/>
						</svg>
						Minimize
					</button>
				</div>
				<div className={styles.alignProjectsContent}>
					<ProjectsColumn setTopStatisticsCount={setTopStatisticsCount} />
					{/*  */}
				</div>
			</div>

			{/* ======================= Team Work Section ====================== */}

			<div className={styles.teamWork} style={{ position: 'relative' }}>
				<div className={styles.outertopStatisticsBar} style={{ position: 'relative' }}>
					<div className={styles.topStatisticsBar}>
						<TopStatistics text={'Tasks Today'} count={topStatisticsCount.tasksToday} />
						<TopStatistics text={'Team Load'} count={totalTickets} />
						<TopStatistics text={'Completions'} count={completedTask} />
					</div>
					<button
						className={styles.expand}
						onClick={() => {
							setExpandmem(true);
						}}
						style={{
							display: `${expandmem ? 'none' : 'flex'}`,
							position: 'absolute',
							right: '50px'
						}}
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							stroke-width='1.5'
							stroke='currentColor'
							class='w-6 h-6'
							style={{ width: '25px', color: 'white' }}
						>
							<path
								stroke-linecap='round'
								stroke-linejoin='round'
								d='M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15'
							/>
						</svg>
						Expand
					</button>
					<button
						className={styles.expand}
						style={{
							display: `${expandmem ? 'flex' : 'none'}`,
							position: 'absolute',
							right: '50px'
						}}
						onClick={() => {
							setExpandmem(false);
						}}
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							stroke-width='1.5'
							stroke='currentColor'
							class='w-6 h-6'
							style={{ width: '25px', color: 'white' }}
						>
							<path
								stroke-linecap='round'
								stroke-linejoin='round'
								d='M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
							/>
						</svg>
						Minimize
					</button>
				</div>
				<div className={styles.alignTeamContent}>
					<TeamWork
						isInverted={true}
						screenIndex={2}
						showTeamTabTop={true}
						showTabComponent={false}
						showActionButtons={true}
					/>
				</div>
			</div>
			<div
				className='big-dashboard-footer'
				style={{
					margin: '1rem',
					position: 'fixed',
					bottom: '0',
					backgroundColor: 'white',
					padding: '5px',
					paddingLeft: '10px',
					paddingRight: '10px',
					borderRadius: '5px',
					outline: 'none',
					fontWeight: '700'
				}}
			>
				<Link to='/homepage' onClick={scrollTop}>
					Go to Homepage
				</Link>
			</div>
			<div
				style={{
					position: 'fixed',
					bottom: '50%',
					rotate: '90deg',
					backgroundColor: 'white',
					padding: '5px',
					paddingLeft: '10px',
					paddingRight: '10px',
					borderRadius: '5px',
					outline: 'none',
					fontWeight: '700',
					display: 'none'
				}}
			>
				No Work
			</div>
		</div>
	);
};

export default BigDashboard;

