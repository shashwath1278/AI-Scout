import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminToolsList } from "@/components/admin-tools-list"

export default function AdminPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <Tabs defaultValue="tools" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="tools">Manage Tools</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="tools">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>AI Tools</CardTitle>
                <CardDescription>Manage your AI tools database. Add, edit, or remove tools.</CardDescription>
              </CardHeader>
              <CardContent>
                <AdminToolsList />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Add New Tool</CardTitle>
                <CardDescription>Add a new AI tool to the database.</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Tool Name</Label>
                    <Input id="name" placeholder="e.g., ChatGPT" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input id="category" placeholder="e.g., Chatbots" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <textarea
                      id="description"
                      className="w-full min-h-[100px] p-2 border rounded-md"
                      placeholder="Describe the tool..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pricing">Pricing</Label>
                    <select id="pricing" className="w-full p-2 border rounded-md">
                      <option value="Free">Free</option>
                      <option value="Freemium">Freemium</option>
                      <option value="Paid">Paid</option>
                      <option value="Enterprise">Enterprise</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="url">Website URL</Label>
                    <Input id="url" placeholder="https://example.com" />
                  </div>

                  <Button className="w-full">Add Tool</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Manage Categories</CardTitle>
              <CardDescription>Add, edit, or remove categories for AI tools.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-medium mb-4">Current Categories</h3>
                  <div className="space-y-2">
                    {[
                      "Development",
                      "Chatbots",
                      "Design",
                      "Marketing",
                      "Content Creation",
                      "Data Analysis",
                      "Productivity",
                      "Research",
                    ].map((category) => (
                      <div key={category} className="flex items-center justify-between p-2 border rounded-md">
                        <span>{category}</span>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button variant="destructive" size="sm">
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Add New Category</h3>
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="categoryName">Category Name</Label>
                      <Input id="categoryName" placeholder="e.g., AI Assistants" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="categoryDescription">Description (Optional)</Label>
                      <Input id="categoryDescription" placeholder="Brief description of this category" />
                    </div>

                    <Button>Add Category</Button>
                  </form>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Website Settings</CardTitle>
              <CardDescription>Manage general settings for your AI tools directory.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Website Name</Label>
                  <Input id="siteName" defaultValue="AI Tools Directory" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Website Description</Label>
                  <textarea
                    id="siteDescription"
                    className="w-full min-h-[100px] p-2 border rounded-md"
                    defaultValue="Discover the perfect AI tool for your needs. Search through our curated collection of AI tools for development, design, content creation, and more."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input id="contactEmail" type="email" placeholder="admin@example.com" />
                </div>

                <div className="space-y-2">
                  <Label>Featured Section</Label>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="showTrending" defaultChecked />
                    <Label htmlFor="showTrending">Show Trending Tools Section</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="showNew" defaultChecked />
                    <Label htmlFor="showNew">Show New Tools Section</Label>
                  </div>
                </div>

                <Button>Save Settings</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

