import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Loader2 } from "lucide-react"
import { CustomSelect } from "@/components/CustomSelect"
import { toast } from "sonner"

export function AdminForm() {
    const { id } = useParams()
    const navigate = useNavigate()
    const isEditing = !!id

    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        state: "Kuala Lumpur",
        address: "",
        latitude: "",
        longitude: "",
        score: "",
        keypoint1: "",
        keypoint2: "",
        keypoint3: "",
        tiktokUrl: "",
        imageUrl: "",
        date: new Date().toISOString().split('T')[0]
    })

    // Check authentication
    useEffect(() => {
        const isAuthenticated = localStorage.getItem("admin_authenticated") === "true"
        if (!isAuthenticated) {
            toast.error("Please login first")
            navigate('/admin')
        }
    }, [navigate])

    const stateOptions = [
        { value: "Kuala Lumpur", label: "Kuala Lumpur" },
        { value: "Selangor", label: "Selangor" },
        { value: "Penang", label: "Penang" },
        { value: "Johor", label: "Johor" },
        { value: "Perak", label: "Perak" },
        { value: "Melaka", label: "Melaka" },
        { value: "Sabah", label: "Sabah" },
        { value: "Sarawak", label: "Sarawak" },
        { value: "Kedah", label: "Kedah" },
        { value: "Pahang", label: "Pahang" },
        { value: "Terengganu", label: "Terengganu" },
        { value: "Kelantan", label: "Kelantan" },
        { value: "Negeri Sembilan", label: "Negeri Sembilan" },
        { value: "Perlis", label: "Perlis" },
        { value: "Putrajaya", label: "Putrajaya" },
        { value: "Labuan", label: "Labuan" },
    ]

    useEffect(() => {
        if (isEditing) {
            // Fetch vendor data
            fetch('/api/vendors')
                .then(res => res.json())
                .then(data => {
                    const vendor = data.find((v: any) => v.id === id)
                    if (vendor) {
                        setFormData({
                            name: vendor.name,
                            state: vendor.state,
                            address: vendor.address,
                            latitude: vendor.latitude.toString(),
                            longitude: vendor.longitude.toString(),
                            score: vendor.jason_score.toString(),
                            keypoint1: vendor.keypoints[0] || "",
                            keypoint2: vendor.keypoints[1] || "",
                            keypoint3: vendor.keypoints[2] || "",
                            tiktokUrl: vendor.tiktok_url || "",
                            imageUrl: vendor.image_url || "",
                            date: vendor.review_date || new Date().toISOString().split('T')[0]
                        })
                    }
                })
                .catch(() => toast.error("Failed to load vendor"))
        }
    }, [id, isEditing])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleStateChange = (value: string) => {
        setFormData({ ...formData, state: value })
    }

    const handleSubmit = async () => {
        setIsLoading(true)
        const toastId = toast.loading(isEditing ? "Updating vendor..." : "Creating vendor...")

        try {
            const response = await fetch('/api/vendors', {
                method: isEditing ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: isEditing ? id : undefined,
                    name: formData.name,
                    state: formData.state,
                    address: formData.address,
                    latitude: parseFloat(formData.latitude),
                    longitude: parseFloat(formData.longitude),
                    jason_score: parseFloat(formData.score),
                    keypoints: [formData.keypoint1, formData.keypoint2, formData.keypoint3].filter(Boolean),
                    tiktok_url: formData.tiktokUrl,
                    image_url: formData.imageUrl,
                    review_date: formData.date
                })
            })

            if (!response.ok) throw new Error("Failed to save vendor")

            toast.success(isEditing ? "Vendor updated!" : "Vendor created!", { id: toastId })
            navigate('/admin')
        } catch (err: any) {
            toast.error(err.message, { id: toastId })
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = () => {
        toast("Are you sure you want to delete?", {
            description: "This action cannot be undone.",
            action: {
                label: "Delete",
                onClick: () => executeDelete(),
            },
            cancel: {
                label: "Cancel",
                onClick: () => { },
            },
        })
    }

    const executeDelete = async () => {
        setIsLoading(true)
        const toastId = toast.loading("Deleting vendor...")

        try {
            const response = await fetch(`/api/vendors/${id}`, {
                method: 'DELETE'
            })

            if (!response.ok) throw new Error("Failed to delete vendor")

            toast.success("Vendor deleted!", { id: toastId })
            navigate('/admin')
        } catch (err: any) {
            toast.error(err.message, { id: toastId })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/admin')}
                    className="p-2 hover:bg-stone-100 rounded-full transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-3xl font-heading font-bold">
                        {isEditing ? `Edit: ${formData.name || 'Vendor'}` : 'Add New Vendor'}
                    </h1>
                    <p className="text-stone-600">Fill in the vendor details below</p>
                </div>
            </div>

            {/* Form */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                <div>
                    <label className="text-sm font-medium block mb-2 text-stone-700">Vendor Name</label>
                    <Input name="name" placeholder="Vendor Name" value={formData.name} onChange={handleChange} />
                </div>

                <div>
                    <label className="text-sm font-medium block mb-2 text-stone-700">State</label>
                    <CustomSelect
                        value={formData.state}
                        onChange={handleStateChange}
                        options={stateOptions}
                        placeholder="Select state..."
                    />
                </div>

                <div>
                    <label className="text-sm font-medium block mb-2 text-stone-700">Address</label>
                    <Input name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium block mb-2 text-stone-700">Latitude</label>
                        <Input name="latitude" placeholder="Latitude" value={formData.latitude} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="text-sm font-medium block mb-2 text-stone-700">Longitude</label>
                        <Input name="longitude" placeholder="Longitude" value={formData.longitude} onChange={handleChange} />
                    </div>
                </div>

                <div>
                    <label className="text-sm font-medium block mb-2 text-stone-700">Jason's Score (0-10)</label>
                    <Input name="score" placeholder="Score" value={formData.score} onChange={handleChange} />
                </div>

                <div>
                    <label className="text-sm font-medium block mb-2 text-stone-700">Keypoint 1</label>
                    <Input name="keypoint1" placeholder="Keypoint 1" value={formData.keypoint1} onChange={handleChange} />
                </div>

                <div>
                    <label className="text-sm font-medium block mb-2 text-stone-700">Keypoint 2</label>
                    <Input name="keypoint2" placeholder="Keypoint 2" value={formData.keypoint2} onChange={handleChange} />
                </div>

                <div>
                    <label className="text-sm font-medium block mb-2 text-stone-700">Keypoint 3</label>
                    <Input name="keypoint3" placeholder="Keypoint 3" value={formData.keypoint3} onChange={handleChange} />
                </div>

                <div>
                    <label className="text-sm font-medium block mb-2 text-stone-700">TikTok URL</label>
                    <Input name="tiktokUrl" placeholder="TikTok URL" value={formData.tiktokUrl} onChange={handleChange} />
                </div>

                <div>
                    <label className="text-sm font-medium block mb-2 text-stone-700">Image URL</label>
                    <Input name="imageUrl" placeholder="Image URL" value={formData.imageUrl} onChange={handleChange} />
                </div>

                <div>
                    <label className="text-sm font-medium block mb-2 text-stone-700">Review Date</label>
                    <Input name="date" type="date" value={formData.date} onChange={handleChange} />
                </div>

                <div className="flex gap-2 pt-4">
                    <Button onClick={handleSubmit} disabled={isLoading} className="flex-1 bg-amber-600 hover:bg-amber-700">
                        {isLoading ? <Loader2 className="animate-spin" /> : (isEditing ? "Update Vendor" : "Create Vendor")}
                    </Button>
                    {isEditing && (
                        <Button onClick={handleDelete} disabled={isLoading} className="bg-red-600 text-white hover:bg-red-700">
                            {isLoading ? <Loader2 className="animate-spin" /> : "Delete"}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
