import React from 'react';

export const Ketcher = React.memo(function() {
	return (
			<div>
				<iframe id="ifKetcher" title="ketcher" src="ketcher/ketcher.html" width="800" height="600"></iframe>
			</div>
		);
});