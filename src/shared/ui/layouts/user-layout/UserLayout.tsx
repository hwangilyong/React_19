import {Fragment, type PropsWithChildren} from 'react';

interface UserLayoutProps extends PropsWithChildren {
    title: string
}

const UserLayout = ({title, children}: UserLayoutProps) => {
    return (
        <Fragment>
        </Fragment>
    );
};

export default UserLayout;