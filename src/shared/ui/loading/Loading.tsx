import {Fragment} from 'react';

interface LoadingProps {
    pendings: boolean[];
    /** ms */
    defaultDelay?: number;
}

const Loading = ({pendings, defaultDelay}: LoadingProps) => {
    return (
        <Fragment>
        </Fragment>
    );
};

export default Loading;