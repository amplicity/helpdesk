import React from 'react'


const BreathingCircles = () => {
	const animationDelay2 = {
		animationDelay: '2s'
	};

	return (
		<div className="absolute inset-0 flex items-center justify-center">
			<div className="absolute w-[40rem] h-[40rem] bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
			<div
				className="absolute w-[40rem] h-[40rem] bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob "
				style={animationDelay2}
			></div>
		</div>
	)
};

export default BreathingCircles;


