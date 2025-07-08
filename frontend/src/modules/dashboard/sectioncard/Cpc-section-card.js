'use client';

import {
  IconTrendingDown,
  IconTrendingUp,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useMemo, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllTaskList,
} from "@/store/features/in-project/TaskSlice";
import {
  fetchClients,
  fetchAllProjects,
} from "@/store/features/in-project/projectSlice";

// Skeleton Loader
const CardSkeleton = () => (
  <Card className="@container/card animate-pulse">
    <CardHeader>
      <CardDescription>
        <span className="inline-block h-4 w-50 bg-muted rounded" />
      </CardDescription>
      <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
        <span className="inline-block h-8 w-16 bg-muted rounded" />
      </CardTitle>
      <CardAction>
        <span className="inline-block h-6 w-16 bg-muted rounded-full" />
      </CardAction>
    </CardHeader>
    <CardFooter className="flex-col items-start gap-1.5 text-sm">
      <div className="line-clamp-1 flex gap-2 font-medium">
        <span className="inline-block h-4 w-32 bg-muted rounded" />
      </div>
      <div className="text-muted-foreground">
        <span className="inline-block h-4 w-40 bg-muted rounded" />
      </div>
    </CardFooter>
  </Card>
);

export function SectionCardCPC() {
  const dispatch = useDispatch();
  const [loadedCards, setLoadedCards] = useState({
    projects: false,
    clients: false,
    tasks: false,
    growth: true,
  });

  const { projects, status } = useSelector((state) => state.project);
  const { clients, status: clientsStatus } = useSelector((state) => state.project);
  const { allTaskList, status: taskStatus } = useSelector((state) => state.task);

  const counts = useMemo(() => ({
    projects: projects?.length || 0,
    clients: Array.isArray(clients) ? clients.length : 0,
    tasks: allTaskList?.length || 0,
  }), [projects, clients, allTaskList]);

  const fetchAllData = useCallback(() => {
    const promises = [];

    if (clientsStatus === "idle" || !clients?.length) {
      promises.push(dispatch(fetchClients()).unwrap().catch(() => []));
    }
    if (status === "idle" || !projects?.length) {
      promises.push(dispatch(fetchAllProjects()).unwrap().catch(() => []));
    }
    if (taskStatus === "idle" || !allTaskList?.length) {
      promises.push(dispatch(getAllTaskList()).unwrap().catch(() => []));
    }

    Promise.allSettled(promises).catch(console.error);
  }, [dispatch, status, taskStatus, clientsStatus]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  useEffect(() => {
    setLoadedCards((prev) => ({
      ...prev,
      projects: projects !== null,
      clients: clientsStatus === "succeeded" && clients !== null,
      tasks: taskStatus === "succeeded" && allTaskList !== null,
    }));
  }, [status, clientsStatus, taskStatus, projects, clients, allTaskList]);

  const isProjectsLoading = status === "loading" || !loadedCards.projects;
  const isClientsLoading = clientsStatus === "loading" || !loadedCards.clients;
  const isTasksLoading = taskStatus === "loading" || !loadedCards.tasks;

  const ProjectsCard = useMemo(() => (
    isProjectsLoading ? <CardSkeleton /> : (
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Projects</CardDescription>
          <CardTitle className="text-2xl font-semibold">{counts.projects}</CardTitle>
          <CardAction>
            <Badge variant="outline"><IconTrendingUp /> +12.5%</Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium">Trending up this month <IconTrendingUp className="size-4" /></div>
          <div className="text-muted-foreground">Visitors for the last 6 months</div>
        </CardFooter>
      </Card>
    )
  ), [isProjectsLoading, counts.projects]);

  const ClientsCard = useMemo(() => (
    isClientsLoading ? <CardSkeleton /> : (
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>All Clients</CardDescription>
          <CardTitle className="text-2xl font-semibold">{counts.clients}</CardTitle>
          <CardAction>
            <Badge variant="outline"><IconTrendingDown /> -20%</Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium">Down 20% this period <IconTrendingDown className="size-4" /></div>
          <div className="text-muted-foreground">Acquisition needs attention</div>
        </CardFooter>
      </Card>
    )
  ), [isClientsLoading, counts.clients]);

  const TasksCard = useMemo(() => (
    isTasksLoading ? <CardSkeleton /> : (
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active Tasks</CardDescription>
          <CardTitle className="text-2xl font-semibold">{counts.tasks}</CardTitle>
          <CardAction>
            <Badge variant="outline"><IconTrendingUp /> +12.5%</Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium">Strong user retention <IconTrendingUp className="size-4" /></div>
          <div className="text-muted-foreground">Engagement exceeds targets</div>
        </CardFooter>
      </Card>
    )
  ), [isTasksLoading, counts.tasks]);

  const GrowthCard = useMemo(() => (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>Growth Rate</CardDescription>
        <CardTitle className="text-2xl font-semibold">4.5%</CardTitle>
        <CardAction>
          <Badge variant="outline"><IconTrendingUp /> +4.5%</Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="flex gap-2 font-medium">Steady performance increase <IconTrendingUp className="size-4" /></div>
        <div className="text-muted-foreground">Meets growth projections</div>
      </CardFooter>
    </Card>
  ), []);

  return (
    <div className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 xl:grid-cols-4 lg:px-6">
      {ProjectsCard}
      {ClientsCard}
      {TasksCard}
      {GrowthCard}
    </div>
  );
}
