"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  getCampaignsControllerFindAllQueryKey,
  getCampaignsControllerFindOneQueryKey,
  useCampaignsControllerAssignInfluencer,
  useCampaignsControllerFindOne,
  useCampaignsControllerRemoveInfluencer,
  useUsersControllerGetInfluencers,
} from "@workspace/client";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Badge } from "@workspace/ui/components/badge";
import { Label } from "@workspace/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { ArrowLeft, Loader2, UserPlus, UserX } from "lucide-react";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";

type CampaignAssignment = {
  id: string;
  influencerId: string;
  influencer?: { id: string; name?: string | null; email?: string | null };
};

type Campaign = {
  id: string;
  title?: string;
  brandName: string;
  assignments?: CampaignAssignment[];
};

type Influencer = {
  id: string;
  name?: string | null;
  email: string;
  status: string;
  gender?: string | null;
  ageBracket?: string | null;
  isStudent?: boolean | null;
  schoolName?: string | null;
};

type BulkAssignResponse = {
  assignedCount: number;
  matchedCount: number;
};

const allSchoolOptions = [
  "University of Ghana",
  "Kwame Nkrumah University of Science and Technology",
  "University of Cape Coast",
  "Ashesi University",
  "Ghana Institute of Management and Public Administration",
  "University of Professional Studies, Accra",
  "Central University",
  "Methodist University College Ghana",
  "Accra Institute of Technology",
  "Regent University College",
  "Valley View University",
  "University of Education, Winneba",
  "Takoradi Technical University",
  "Kumasi Technical University",
  "Ghana Technology University College",
  "Cape Coast Technical University",
  "Accra Technical University",
  "Koforidua Technical University",
  "Sunyani Technical University",
  "Ho Technical University",
  "Faso College of Accra",
  "Islamic University College",
  "Wisconsin International University College",
  "Ghana-India Education Centre",
  "Pan African University",
  "Pearlfield University College",
  "EMS College of Education",
  "Akenten Appiah-Menka University of Skills Training and Entrepreneurial Development",
];

const formatAgeBracket = (value?: string | null) => {
  if (!value) return "—";
  switch (value) {
    case "age_18_24":
      return "18 - 24";
    case "age_25_34":
      return "25 - 34";
    case "age_35_44":
      return "35 - 44";
    case "age_45_54":
      return "45 - 54";
    case "age_55_plus":
      return "55+";
    default:
      return value;
  }
};

export default function CampaignInfluencersPage() {
  const params = useParams();
  const queryClient = useQueryClient();
  const campaignId = params.id as string;

  const [search, setSearch] = useState("");
  const [bulkGender, setBulkGender] = useState<string>("all");
  const [bulkAgeBracket, setBulkAgeBracket] = useState<string>("all");
  const [bulkStudentsOnly, setBulkStudentsOnly] = useState<boolean>(false);
  const [bulkNonStudentsOnly, setBulkNonStudentsOnly] =
    useState<boolean>(false);
  const [bulkSelectedSchools, setBulkSelectedSchools] = useState<string[]>([]);
  const [bulkResult, setBulkResult] = useState<string>("");
  const [isBulkAssigning, setIsBulkAssigning] = useState(false);

  const {
    data: campaignResponse,
    isLoading: isCampaignLoading,
    isError: isCampaignError,
    refetch: refetchCampaign,
  } = useCampaignsControllerFindOne(campaignId);

  const campaign = campaignResponse as unknown as Campaign | undefined;

  const {
    data: influencersResponse,
    isLoading: isInfluencersLoading,
    isError: isInfluencersError,
    refetch: refetchInfluencers,
  } = useUsersControllerGetInfluencers({ status: "approved" });

  const influencers = useMemo(
    () => (influencersResponse as unknown as Influencer[]) || [],
    [influencersResponse],
  );

  const availableSchools = allSchoolOptions;

  const assignedInfluencerIds = useMemo(() => {
    const ids = new Set<string>();
    (campaign?.assignments || []).forEach((a) => {
      if (a.influencerId) ids.add(a.influencerId);
    });
    return ids;
  }, [campaign?.assignments]);

  const filteredInfluencers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return influencers;
    return influencers.filter((inf) => {
      const name = (inf.name || "").toLowerCase();
      const email = (inf.email || "").toLowerCase();
      return (
        name.includes(q) ||
        email.includes(q) ||
        inf.id.toLowerCase().includes(q)
      );
    });
  }, [influencers, search]);

  const invalidateCampaignQueries = () => {
    queryClient.invalidateQueries({
      queryKey: getCampaignsControllerFindOneQueryKey(campaignId),
    });
    queryClient.invalidateQueries({
      queryKey: getCampaignsControllerFindAllQueryKey(),
    });
  };

  const runBulkAssign = async () => {
    setBulkResult("");
    setIsBulkAssigning(true);

    try {
      const storage =
        typeof window !== "undefined"
          ? localStorage.getItem("auth-storage")
          : null;
      const token = storage
        ? (JSON.parse(storage) as { state?: { token?: string } }).state?.token
        : undefined;

      const isStudent = bulkStudentsOnly
        ? true
        : bulkNonStudentsOnly
          ? false
          : undefined;

      const body: Record<string, unknown> = {};
      if (bulkGender !== "all") body.gender = bulkGender;
      if (bulkAgeBracket !== "all") body.ageBracket = bulkAgeBracket;
      if (typeof isStudent === "boolean") body.isStudent = isStudent;
      if (bulkSelectedSchools.length > 0) body.schools = bulkSelectedSchools;

      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:6004";
      const res = await fetch(
        `${baseUrl}/api/campaigns/${campaignId}/assign-bulk`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(body),
        },
      );

      const data = (await res.json()) as unknown;

      if (!res.ok) {
        const message =
          typeof data === "object" && data !== null
            ? (data as { message?: string }).message
            : undefined;
        throw new Error(message || "Bulk assignment failed");
      }

      const typed = data as BulkAssignResponse;
      setBulkResult(
        `Assigned ${typed.assignedCount} of ${typed.matchedCount} matched influencers.`,
      );
      invalidateCampaignQueries();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Bulk assignment failed";
      setBulkResult(msg);
    } finally {
      setIsBulkAssigning(false);
    }
  };

  const assignMutation = useCampaignsControllerAssignInfluencer({
    mutation: {
      onSuccess: () => {
        invalidateCampaignQueries();
      },
    },
  });

  const removeMutation = useCampaignsControllerRemoveInfluencer({
    mutation: {
      onSuccess: () => {
        invalidateCampaignQueries();
      },
    },
  });

  if (isCampaignLoading) {
    return <LoadingState text="Loading campaign..." />;
  }

  if (isCampaignError || !campaign) {
    return (
      <ErrorState
        title="Failed to load campaign"
        message="There was an error loading the campaign."
        onRetry={() => refetchCampaign()}
      />
    );
  }

  if (isInfluencersLoading) {
    return <LoadingState text="Loading influencers..." />;
  }

  if (isInfluencersError) {
    return (
      <ErrorState
        title="Failed to load influencers"
        message="There was an error loading the influencers."
        onRetry={() => refetchInfluencers()}
      />
    );
  }

  const isMutating =
    assignMutation.isPending || removeMutation.isPending || isBulkAssigning;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/admin/campaigns/${campaignId}`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Assign Influencers
            </h1>
            <p className="text-muted-foreground">
              {campaign.title || campaign.brandName}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            Assigned: {campaign.assignments?.length || 0}
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Influencers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border p-4 space-y-4">
            <div className="font-medium">Bulk assign</div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select value={bulkGender} onValueChange={setBulkGender}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                    <SelectItem value="PreferNotToSay">
                      Prefer not to say
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Age bracket</Label>
                <Select
                  value={bulkAgeBracket}
                  onValueChange={setBulkAgeBracket}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select age bracket" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="age_18_24">18 - 24</SelectItem>
                    <SelectItem value="age_25_34">25 - 34</SelectItem>
                    <SelectItem value="age_35_44">35 - 44</SelectItem>
                    <SelectItem value="age_45_54">45 - 54</SelectItem>
                    <SelectItem value="age_55_plus">55+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Student</Label>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={bulkStudentsOnly}
                    onCheckedChange={(v) => {
                      const checked = Boolean(v);
                      setBulkStudentsOnly(checked);
                      if (checked) setBulkNonStudentsOnly(false);
                      if (!checked) setBulkSelectedSchools([]);
                    }}
                  />
                  <span className="text-sm">Students only</span>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={bulkNonStudentsOnly}
                    onCheckedChange={(v) => {
                      const checked = Boolean(v);
                      setBulkNonStudentsOnly(checked);
                      if (checked) setBulkStudentsOnly(false);
                      if (checked) setBulkSelectedSchools([]);
                    }}
                  />
                  <span className="text-sm">Non-students only</span>
                </div>
              </div>
            </div>

            {bulkStudentsOnly && availableSchools.length > 0 ? (
              <div className="space-y-2">
                <Label>Schools (optional)</Label>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {availableSchools.map((school) => {
                    const checked = bulkSelectedSchools.includes(school);
                    return (
                      <label
                        key={school}
                        className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm"
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(v) => {
                            const next = Boolean(v);
                            setBulkSelectedSchools((prev) =>
                              next
                                ? Array.from(new Set([...prev, school]))
                                : prev.filter((s) => s !== school),
                            );
                          }}
                        />
                        <span className="truncate" title={school}>
                          {school}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ) : null}

            <div className="flex items-center gap-3">
              <Button onClick={runBulkAssign} disabled={isMutating}>
                {isBulkAssigning ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : null}
                Bulk Assign
              </Button>

              {bulkResult ? (
                <span className="text-sm text-muted-foreground">
                  {bulkResult}
                </span>
              ) : null}
            </div>
          </div>

          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or id..."
          />

          {filteredInfluencers.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-10">
              No influencers found.
            </div>
          ) : (
            <div className="space-y-2">
              {filteredInfluencers.map((inf) => {
                const isAssigned = assignedInfluencerIds.has(inf.id);

                return (
                  <div
                    key={inf.id}
                    className="flex items-center justify-between gap-3 rounded-lg border p-3"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="font-medium truncate">
                          {inf.name || "Unnamed influencer"}
                        </div>
                        {isAssigned && <Badge>Assigned</Badge>}
                      </div>
                      <div className="text-sm text-muted-foreground truncate">
                        {inf.email}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {inf.gender || "—"} • {formatAgeBracket(inf.ageBracket)}{" "}
                        • {inf.isStudent ? "Student" : "Non-student"}
                        {inf.isStudent && inf.schoolName
                          ? ` • ${inf.schoolName}`
                          : ""}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isAssigned ? (
                        <Button
                          variant="outline"
                          disabled={isMutating}
                          onClick={() =>
                            removeMutation.mutate({
                              id: campaignId,
                              influencerId: inf.id,
                            })
                          }
                        >
                          {removeMutation.isPending ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <UserX className="h-4 w-4 mr-2" />
                          )}
                          Remove
                        </Button>
                      ) : (
                        <Button
                          disabled={isMutating}
                          onClick={() =>
                            assignMutation.mutate({
                              id: campaignId,
                              influencerId: inf.id,
                            })
                          }
                        >
                          {assignMutation.isPending ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <UserPlus className="h-4 w-4 mr-2" />
                          )}
                          Assign
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
