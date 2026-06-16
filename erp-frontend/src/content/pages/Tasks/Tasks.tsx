import { Container } from "@mui/material";
import { Alert } from "@mui/material";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import PageTitle from "src/components/PageTitle";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import TasksTable from "src/components/TasksTable";
import { PermissionMiddleware } from "src/middlewares/PermissionMiddleware";
import { Task } from "src/models/Task";
import { useRequests } from "src/utils/requests";

const Tasks = () => {
    const [requestLoading, setRequestLoading] = useState(true)
    const [requestError, setRequestError] = useState('')
    const [tasksData, setTasksData] = useState<Task[]>([])

    const { getTasks } = useRequests();

    const handleGetTasks = async () => {
        try {
            const response = await getTasks();

            setRequestError(response.detail)
            setTasksData(response.data?.tasks ?? [])
        } finally {
            setRequestLoading(false)
        }
    }

    useEffect(() => {
        handleGetTasks()
    }, [])

    return (
        <PermissionMiddleware codeName="view_task">
            <Helmet>
                <title>Tarefas</title>
            </Helmet>
            <PageTitleWrapper>
                <PageTitle
                    heading="Tarefas"
                    subHeading="Consulte as tarefas dos funcionários e execute ações em cada uma delas"
                />
            </PageTitleWrapper>

            <Container maxWidth="xl" sx={{
                marginX: requestLoading ? '-10%' : 0,
                transition: 'all .5s'
            }}>
                {requestError && (
                    <Alert severity="warning" sx={{ mb: 3 }}>
                        Não foi possível carregar as tarefas. {requestError}
                    </Alert>
                )}

                <TasksTable
                    tasksList={tasksData}
                    refreshList={handleGetTasks}
                />
            </Container>
        </PermissionMiddleware>
    )
}

export default Tasks;