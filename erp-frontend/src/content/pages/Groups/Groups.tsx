import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import PageTitle from 'src/components/PageTitle';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { PermissionMiddleware } from 'src/middlewares/PermissionMiddleware';
import { GroupDetail } from 'src/models/Group';
import { useRequests } from 'src/utils/requests';
import { Alert, Container } from '@mui/material';
import GroupsTable from 'src/components/GroupsTable';

const Groups = () => {
    const [requestLoading, setRequestLoading] = useState(true);
    const [requestError, setRequestError] = useState('');
    const [groupsData, setGroupsData] = useState<GroupDetail[]>([])

    const { getGroups } = useRequests();

    const handleGetGroups = async () => {
        try {
            const response = await getGroups();

            setRequestError(response.detail)
            setGroupsData(response.data?.groups ?? [])
        } finally {
            setRequestLoading(false)
        }
    }

    useEffect(() => {
        handleGetGroups();
    }, [])

    return (
        <PermissionMiddleware codeName='view_group'>
            <>
                <Helmet>
                    <title>Cargos</title>
                </Helmet>

                <PageTitleWrapper>
                    <PageTitle
                        heading="Cargos"
                        subHeading="Consulte os cargos da empresa e execute ações"
                    />
                </PageTitleWrapper>
            </>

            <Container
                maxWidth="xl"
                sx={{
                    marginX: requestLoading ? '-10%' : 0,
                    transition: 'all .5s'
                }}
            >
                {requestError && (
                    <Alert severity="warning" sx={{ mb: 3 }}>
                        Não foi possível carregar os cargos. {requestError}
                    </Alert>
                )}

                <GroupsTable
                    refreshList={handleGetGroups}
                    groupsList={groupsData}
                />
            </Container>
        </PermissionMiddleware>
    );
}

export default Groups;